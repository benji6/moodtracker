import {
  AppCreateEvent,
  AppEvent,
  AppUpdateEvent,
  EventTypeTuple,
  Mood,
  NormalizedMeditations,
  NormalizedMoods,
  NormalizedSleeps,
  NormalizedWeights,
} from "../types";
import {
  Interval,
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
} from "date-fns";
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import {
  computeAverageMoodInInterval,
  computeMeanSafe,
  defaultDict,
  formatIsoDateHourInLocalTimezone,
  formatIsoDateInLocalTimezone,
  getEnvelopingIds,
  getIdsInInterval,
  getNormalizedTagsFromDescription,
} from "../utils";
import { MINIMUM_WORD_CLOUD_WORDS } from "../constants";
import { WEEK_OPTIONS } from "../formatters/dateTimeFormatters";
import { captureException } from "../sentry";

interface EventsState {
  allIds: string[];
  byId: { [id: string]: AppEvent };

  // Is false until initial load from server succeeds or errors.
  // This allows us to display a loading spinner when switching users.
  hasLoadedFromServer: boolean;
  idsToSync: string[];
  isSyncingFromServer: boolean;
  isSyncingToServer: boolean;
  nextCursor: string | undefined;
  syncFromServerError: boolean;
  syncToServerError: boolean;
}

export type EventsStateToStore = Omit<
  EventsState,
  | "isSyncingFromServer"
  | "isSyncingToServer"
  | "syncFromServerError"
  | "syncToServerError"
>;

const allIdsSelector = (state: EventsState) => state.allIds;
const byIdSelector = (state: EventsState) => state.byId;
const allIdsWithLocationSelector = createSelector(
  allIdsSelector,
  byIdSelector,
  (allIds, byId) =>
    allIds.filter((id) => {
      const { payload } = byId[id];
      return (
        typeof payload !== "string" && "location" in payload && payload.location
      );
    }),
);

const trackedCategoriesSelector = createSelector(
  allIdsSelector,
  byIdSelector,
  (
    allIds,
    byId,
  ): {
    meditations: NormalizedMeditations;
    moods: NormalizedMoods;
    sleeps: NormalizedSleeps;
    weights: NormalizedWeights;
  } => {
    const normalizedCategories: {
      meditations: NormalizedMeditations;
      moods: NormalizedMoods;
      sleeps: NormalizedSleeps;
      weights: NormalizedWeights;
    } = {
      meditations: { allIds: [], byId: {} },
      moods: { allIds: [], byId: {} },
      sleeps: { allIds: [], byId: {} },
      weights: { allIds: [], byId: {} },
    };

    for (const id of allIds) {
      const event = byId[id];
      const [_, category, operation] = event.type.split("/") as EventTypeTuple;
      const normalizedCategory = normalizedCategories[category];

      switch (operation) {
        case "create":
          normalizedCategory.allIds.push(event.createdAt);
          normalizedCategory.byId[event.createdAt] = (
            event as AppCreateEvent
          ).payload;
          break;
        case "delete": {
          let index: undefined | number;
          let i = normalizedCategory.allIds.length;

          while (i--)
            if (normalizedCategory.allIds[i] === event.payload) {
              index = i;
              break;
            }

          if (index === undefined) {
            captureException(
              Error(
                `Delete event error - could not find event to delete: ${JSON.stringify(
                  event,
                )}`,
              ),
            );
            break;
          }

          normalizedCategory.allIds.splice(index, 1);
          delete normalizedCategory.byId[event.payload as string];
          break;
        }
        case "update": {
          const { payload } = event as AppUpdateEvent;
          const currentData = normalizedCategory.byId[payload.id];
          const { id: _, ...rest } = payload;

          // for reasons that are beyond my energy to investigate there is
          // a runtime error if you try to update the data object directly
          normalizedCategory.byId[payload.id] = {
            ...currentData,
            ...rest,
            updatedAt: event.createdAt,
          };
        }
      }
    }

    return normalizedCategories;
  },
);

const normalizedMeditationsSelector = createSelector(
  trackedCategoriesSelector,
  ({ meditations }) => meditations,
);

const normalizedMoodsSelector = createSelector(
  trackedCategoriesSelector,
  ({ moods }) => moods,
);

const normalizedSleepsSelector = createSelector(
  trackedCategoriesSelector,
  ({ sleeps }) => sleeps,
);

const normalizedWeightsSelector = createSelector(
  trackedCategoriesSelector,
  ({ weights }) => weights,
);

const moodIdsWithLocationSelector = createSelector(
  normalizedMoodsSelector,
  ({ allIds, byId }): string[] =>
    allIds.filter((id) => {
      const mood = byId[id];
      return "location" in mood && mood.location;
    }),
);

const makeMeanMoodsByPeriodSelector = (
  eachPeriodOfInterval: ({ start, end }: Interval) => Date[],
  addPeriods: (date: Date, n: number) => Date,
  createId = formatIsoDateInLocalTimezone,
) =>
  createSelector(
    normalizedMoodsSelector,
    (moods): { [date: string]: number } => {
      const meanMoods: { [date: string]: number } = {};

      if (!moods.allIds.length) return meanMoods;

      const periods = eachPeriodOfInterval({
        start: new Date(moods.allIds[0]),
        end: new Date(moods.allIds.at(-1)!),
      });

      const finalPeriod = addPeriods(periods.at(-1)!, 1);

      if (moods.allIds.length === 1) {
        meanMoods[createId(periods[0])] = moods.byId[moods.allIds[0]].mood;
        return meanMoods;
      }

      periods.push(finalPeriod);

      for (let i = 1; i < periods.length; i++) {
        const p0 = periods[i - 1];
        const p1 = periods[i];
        const averageMoodInInterval = computeAverageMoodInInterval(
          moods,
          p0,
          p1,
        );
        if (averageMoodInInterval !== undefined)
          meanMoods[createId(p0)] = averageMoodInInterval;
      }

      return meanMoods;
    },
  );

const getLastEvent = (normalizedState: EventsState): AppEvent => {
  if (!normalizedState.allIds.length)
    throw Error("Error: `allIds` must have length > 0");
  const lastId = normalizedState.allIds.at(-1)!;
  return normalizedState.byId[lastId];
};

const denormalize = <TrackedCategory>({
  allIds,
  byId,
}: {
  allIds: string[];
  byId: { [id: string]: TrackedCategory & { updatedAt?: string } };
}) => allIds.map((id) => ({ ...byId[id], createdAt: id }));

const normalizedStateNotEmpty = ({ allIds }: { allIds: string[] }) =>
  Boolean(allIds.length);

const dateFromSelector = (_state: EventsState, dateFrom: Date): Date =>
  dateFrom;
const dateToSelector = (
  _state: EventsState,
  _dateFrom: Date,
  dateTo: Date,
): Date => dateTo;
const denormalizedSleepsSelector = createSelector(
  normalizedSleepsSelector,
  denormalize,
);
const minutesSleptByDateAwokeSelector = createSelector(
  denormalizedSleepsSelector,
  (sleeps) => {
    const sleepByDateAwoke = defaultDict(() => 0);
    for (const { dateAwoke, minutesSlept } of sleeps)
      sleepByDateAwoke[dateAwoke] += minutesSlept;
    return { ...sleepByDateAwoke };
  },
);

const moodsInPeriodResultFunction = (
  { allIds, byId }: NormalizedMoods,
  dateFrom: Date,
  dateTo: Date,
): Mood[] => getIdsInInterval(allIds, dateFrom, dateTo).map((id) => byId[id]);
const secondsMeditatedInPeriodResultFunction = (
  { allIds, byId }: NormalizedMeditations,
  dateFrom: Date,
  dateTo: Date,
): number => {
  let sum = 0;
  for (const id of getIdsInInterval(allIds, dateFrom, dateTo))
    sum += byId[id].seconds;
  return sum;
};

const initialState: EventsState = {
  allIds: [],
  byId: {},
  hasLoadedFromServer: false,
  idsToSync: [],
  isSyncingFromServer: false,
  isSyncingToServer: false,
  syncFromServerError: false,
  syncToServerError: false,
  nextCursor: undefined,
};

export default createSlice({
  name: "events",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<AppEvent>) => {
      const lastEvent = state.allIds.length ? getLastEvent(state) : undefined;
      if (lastEvent && lastEvent.createdAt > action.payload.createdAt) {
        const date = new Date(lastEvent.createdAt);
        date.setUTCMilliseconds(date.getUTCMilliseconds() + 1);
        const newCreatedAt = date.toISOString();
        action.payload.createdAt = newCreatedAt;
      }
      state.allIds.push(action.payload.createdAt);
      state.byId[action.payload.createdAt] = action.payload;
      state.idsToSync.push(action.payload.createdAt);
    },
    clear: () => initialState,
    loadFromStorage: (state, action: PayloadAction<EventsStateToStore>) =>
      Object.assign(state, action.payload),
    syncToServerStart: (state) => {
      state.isSyncingToServer = true;
      state.syncToServerError = false;
    },
    syncToServerError: (state) => {
      state.isSyncingToServer = false;
      state.syncToServerError = true;
    },
    syncToServerSuccess: (state) => {
      state.idsToSync = [];
      state.isSyncingToServer = false;
      state.syncToServerError = false;
    },
    syncFromServerStart: (state) => {
      state.isSyncingFromServer = true;
      state.syncFromServerError = false;
    },
    syncFromServerError: (state) => {
      state.isSyncingFromServer = false;
      state.syncFromServerError = true;
    },
    syncFromServerSuccess: (
      state,
      action: PayloadAction<{ cursor: string; events: AppEvent[] }>,
    ) => {
      state.isSyncingFromServer = false;
      state.syncFromServerError = false;
      state.hasLoadedFromServer = true;
      state.nextCursor = action.payload.cursor;
      if (!action.payload.events.length) return;
      const serverEventIds = action.payload.events.map(
        (event) => event.createdAt,
      );
      if (serverEventIds.every((id) => id in state.byId)) return;
      for (const event of action.payload.events)
        state.byId[event.createdAt] = event;
      state.allIds = (
        state.allIds.length
          ? [...new Set([...state.allIds, ...serverEventIds])]
          : serverEventIds
      )
        // The API offers no order guarantees
        .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
    },
  },
  selectors: {
    allIds: allIdsSelector,
    byId: byIdSelector,
    hasLoadedFromServer: (state: EventsState) => state.hasLoadedFromServer,
    idsToSync: (state: EventsState) => state.idsToSync,
    idsWithLocationInPeriod: createSelector(
      allIdsWithLocationSelector,
      dateFromSelector,
      dateToSelector,
      getIdsInInterval,
    ),
    isSyncingFromServer: (state: EventsState) => state.isSyncingFromServer,
    isSyncingToServer: (state: EventsState) => state.isSyncingToServer,
    nextCursor: (state: EventsState) => state.nextCursor,
    syncFromServerError: (state: EventsState) => state.syncFromServerError,
    syncToServerError: (state: EventsState) => state.syncToServerError,
    allIdsWithLocation: allIdsWithLocationSelector,
    moodIdsWithLocation: moodIdsWithLocationSelector,
    moodIdsWithLocationInPeriod: createSelector(
      moodIdsWithLocationSelector,
      dateFromSelector,
      dateToSelector,
      getIdsInInterval,
    ),
    denormalizedMeditations: createSelector(
      normalizedMeditationsSelector,
      denormalize,
    ),
    denormalizedMoods: createSelector(normalizedMoodsSelector, denormalize),
    denormalizedSleeps: denormalizedSleepsSelector,
    denormalizedWeights: createSelector(normalizedWeightsSelector, denormalize),
    envelopingMoodIds: createSelector(
      normalizedMoodsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds }, dateFrom, dateTo) =>
        getEnvelopingIds(allIds, dateFrom, dateTo),
    ),
    envelopingWeightIds: createSelector(
      normalizedWeightsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds }, dateFrom, dateTo) =>
        getEnvelopingIds(allIds, dateFrom, dateTo),
    ),
    envelopingIdsWithLocation: createSelector(
      allIdsWithLocationSelector,
      dateFromSelector,
      dateToSelector,
      getEnvelopingIds,
    ),
    hasMoods: createSelector(normalizedMoodsSelector, normalizedStateNotEmpty),
    hasMeditations: createSelector(
      normalizedMeditationsSelector,
      normalizedStateNotEmpty,
    ),
    hasSleeps: createSelector(
      normalizedSleepsSelector,
      normalizedStateNotEmpty,
    ),
    hasWeights: createSelector(
      normalizedWeightsSelector,
      normalizedStateNotEmpty,
    ),
    meanDailySleepDurationInPeriod: createSelector(
      minutesSleptByDateAwokeSelector,
      dateFromSelector,
      dateToSelector,
      (
        minutesSleptByDateAwoke,
        dateFrom: Date,
        dateTo: Date,
      ): number | undefined => {
        const dateToString = formatIsoDateInLocalTimezone(dateTo);
        const minutesSleptArray: number[] = [];
        for (
          let date = formatIsoDateInLocalTimezone(dateFrom);
          date < dateToString;
          date = formatIsoDateInLocalTimezone(addDays(date, 1))
        ) {
          const minutesSlept = minutesSleptByDateAwoke[date];
          if (minutesSlept === undefined) continue;
          minutesSleptArray.push(minutesSlept);
        }
        return computeMeanSafe(minutesSleptArray);
      },
    ),
    minutesSleptByDateAwoke: minutesSleptByDateAwokeSelector,
    meanWeightInPeriod: createSelector(
      normalizedWeightsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds, byId }, dateFrom: Date, dateTo: Date) =>
        computeMeanSafe(
          getIdsInInterval(allIds, dateFrom, dateTo)
            .map((id) => byId[id])
            .map(({ value }) => value),
        ),
    ),
    meditationIdsInPeriod: createSelector(
      normalizedMeditationsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds }, dateFrom: Date, dateTo: Date) =>
        getIdsInInterval(allIds, dateFrom, dateTo),
    ),
    moodCloudWords: createSelector(
      normalizedMoodsSelector,
      dateFromSelector,
      dateToSelector,
      (
        normalizedMoods,
        dateFrom: Date,
        dateTo: Date,
      ): { [word: string]: number } | undefined => {
        const moodsInPeriod = moodsInPeriodResultFunction(
          normalizedMoods,
          dateFrom,
          dateTo,
        );

        const words: { [word: string]: number } = {};
        for (const { description } of moodsInPeriod) {
          const normalizedDescriptionWords = description
            ? getNormalizedTagsFromDescription(description)
            : [];
          for (const caseNormalizedWord of normalizedDescriptionWords) {
            if (words[caseNormalizedWord]) words[caseNormalizedWord] += 1;
            else words[caseNormalizedWord] = 1;
          }
        }

        return Object.keys(words).length < MINIMUM_WORD_CLOUD_WORDS
          ? undefined
          : words;
      },
    ),
    // some code may depend on the fact that the array
    // value in the returned object cannot be empty
    moodIdsByDate: createSelector(
      normalizedMoodsSelector,
      ({ allIds }): { [date: string]: string[] } => {
        const moodsByDate = defaultDict((): string[] => []);
        for (const id of allIds)
          moodsByDate[formatIsoDateInLocalTimezone(new Date(id))].push(id);
        return { ...moodsByDate };
      },
    ),
    moodIdsInPeriod: createSelector(
      normalizedMoodsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds }, dateFrom: Date, dateTo: Date): string[] =>
        getIdsInInterval(allIds, dateFrom, dateTo),
    ),
    moodsInPeriod: createSelector(
      normalizedMoodsSelector,
      dateFromSelector,
      dateToSelector,
      moodsInPeriodResultFunction,
    ),
    normalizedDescriptionWords: createSelector(
      normalizedMoodsSelector,
      (normalizedMoods): string[] => {
        const descriptionWords = new Set<string>();
        for (let i = 0; i < normalizedMoods.allIds.length; i++) {
          const id = normalizedMoods.allIds[i];
          const { description } = normalizedMoods.byId[id];
          const normalizedWords = description
            ? getNormalizedTagsFromDescription(description)
            : [];
          for (let j = 0; j < normalizedWords.length; j++)
            descriptionWords.add(normalizedWords[j]);
        }
        return [...descriptionWords].sort((a, b) => a.localeCompare(b));
      },
    ),
    normalizedMeditations: normalizedMeditationsSelector,
    normalizedMoods: normalizedMoodsSelector,
    normalizedSleeps: normalizedSleepsSelector,
    normalizedSleepsSortedByDateAwoke: createSelector(
      normalizedSleepsSelector,
      (normalizedSleeps) => ({
        ...normalizedSleeps,
        // sorting is stable so 2 events with same dateAwoke will be ordered by event id
        allIds: [...normalizedSleeps.allIds].sort((a, b) => {
          const dateAwokeA = normalizedSleeps.byId[a].dateAwoke;
          const dateAwokeB = normalizedSleeps.byId[b].dateAwoke;
          return dateAwokeA > dateAwokeB ? 1 : dateAwokeA < dateAwokeB ? -1 : 0;
        }),
      }),
    ),
    normalizedWeights: normalizedWeightsSelector,
    meanMoodsByHour: makeMeanMoodsByPeriodSelector(
      eachHourOfInterval,
      addHours,
      formatIsoDateHourInLocalTimezone,
    ),
    meanMoodsByDay: makeMeanMoodsByPeriodSelector(eachDayOfInterval, addDays),
    meanMoodsByWeek: makeMeanMoodsByPeriodSelector(
      ({ start, end }: Interval) =>
        eachWeekOfInterval({ start, end }, WEEK_OPTIONS),
      addWeeks,
    ),
    meanMoodsByMonth: makeMeanMoodsByPeriodSelector(
      eachMonthOfInterval,
      addMonths,
    ),
    meanMoodsByYear: makeMeanMoodsByPeriodSelector(
      eachYearOfInterval,
      addYears,
    ),
    normalizedTotalSecondsMeditatedByMonth: createSelector(
      normalizedMeditationsSelector,
      (
        normalizedMeditations,
      ): {
        allIds: string[];
        byId: { [k: string]: number | undefined };
      } => {
        const allIds: string[] = [];
        const byId: { [k: string]: number } = {};
        const normalizedTotalSeconds = { allIds, byId };

        if (!normalizedMeditations.allIds.length) return normalizedTotalSeconds;

        const periods = eachMonthOfInterval({
          start: new Date(normalizedMeditations.allIds[0]),
          end: new Date(normalizedMeditations.allIds.at(-1)!),
        });

        const finalPeriod = addMonths(periods.at(-1)!, 1);

        if (normalizedMeditations.allIds.length === 1) {
          const id = formatIsoDateInLocalTimezone(periods[0]);
          allIds.push(id);
          byId[id] =
            normalizedMeditations.byId[normalizedMeditations.allIds[0]].seconds;
          return normalizedTotalSeconds;
        }

        periods.push(finalPeriod);

        for (let i = 1; i < periods.length; i++) {
          const p0 = periods[i - 1];
          const p1 = periods[i];
          const id = formatIsoDateInLocalTimezone(p0);
          allIds.push(id);
          byId[id] = secondsMeditatedInPeriodResultFunction(
            normalizedMeditations,
            p0,
            p1,
          );
        }

        return normalizedTotalSeconds;
      },
    ),
    secondsMeditatedInPeriod: createSelector(
      normalizedMeditationsSelector,
      dateFromSelector,
      dateToSelector,
      secondsMeditatedInPeriodResultFunction,
    ),
  },
});
