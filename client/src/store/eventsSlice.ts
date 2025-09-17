import {
  AppCreateEvent,
  AppEvent,
  AppUpdateEvent,
  EventTypeCategories,
  EventTypeTuple,
  Mood,
  DenormalizedMoodWithExperiencedAt,
  NormalizedAllCategories,
  NormalizedLegRaises,
  NormalizedMeditations,
  NormalizedMoods,
  NormalizedPushUps,
  NormalizedRuns,
  NormalizedSitUps,
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
  compareFunctionForStringSorting,
  computeAverageMoodInInterval,
  computeMean,
  computeMeanSafe,
  defaultDict,
  formatIsoDateHourInLocalTimezone,
  formatIsoDateInLocalTimezone,
  getEnvelopingEvents,
  getEnvelopingIds,
  getEventsInInterval,
  getIdsInInterval,
  getNormalizedWordCloudWords,
  hasEventsInInterval,
  hasIdsInInterval,
} from "../utils";
import { MINIMUM_WORD_CLOUD_WORDS } from "../constants";
import { WEEK_OPTIONS } from "../formatters/dateTimeFormatters";
import { captureException } from "../sentry";

interface EventsState {
  allIds: string[];
  byId: Record<string, AppEvent>;

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

interface NormalizedTrackedCategories {
  all: NormalizedAllCategories;
  "leg-raises": NormalizedLegRaises;
  meditations: NormalizedMeditations;
  moods: NormalizedMoods;
  "push-ups": NormalizedPushUps;
  "sit-ups": NormalizedSitUps;
  runs: NormalizedRuns;
  sleeps: NormalizedSleeps;
  weights: NormalizedWeights;
}

export const trackedCategoriesSelector = createSelector(
  allIdsSelector,
  byIdSelector,
  (allIds, byId): NormalizedTrackedCategories => {
    const all: NormalizedAllCategories = { allIds: [], byId: {} };
    const normalizedCategories: NormalizedTrackedCategories = {
      all,
      "leg-raises": { allIds: [], byId: {} },
      meditations: { allIds: [], byId: {} },
      moods: { allIds: [], byId: {} },
      "push-ups": { allIds: [], byId: {} },
      runs: { allIds: [], byId: {} },
      "sit-ups": { allIds: [], byId: {} },
      sleeps: { allIds: [], byId: {} },
      weights: { allIds: [], byId: {} },
    };

    for (const id of allIds) {
      const event = byId[id];
      const [, category, operation] = event.type.split("/") as EventTypeTuple;
      const normalizedCategory = normalizedCategories[category];

      switch (operation) {
        case "create":
          all.allIds.push(event.createdAt);
          normalizedCategory.allIds.push(event.createdAt);
          normalizedCategory.byId[event.createdAt] = (
            event as AppCreateEvent
          ).payload;
          all.byId[event.createdAt] = {
            ...normalizedCategory.byId[event.createdAt],
            type: category,
          } as (typeof all.byId)[string];
          break;
        case "delete": {
          if (typeof event.payload !== "string") {
            captureException(
              Error(
                `Delete payload should be a string: ${JSON.stringify(event)}`,
              ),
            );
            break;
          }

          const allIndex = all.allIds.lastIndexOf(event.payload);
          if (allIndex !== -1) {
            all.allIds.splice(allIndex, 1);
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete all.byId[event.payload];
          } else
            captureException(
              Error(
                `Could not find event to delete across all tracked categories: ${JSON.stringify(event)}`,
              ),
            );

          const categoryIndex = normalizedCategory.allIds.lastIndexOf(
            event.payload,
          );
          if (categoryIndex !== -1) {
            normalizedCategory.allIds.splice(categoryIndex, 1);
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete normalizedCategory.byId[event.payload];
          } else
            captureException(
              Error(
                `Could not find event to delete within ${category} category: ${JSON.stringify(event)}`,
              ),
            );
          break;
        }
        case "update": {
          const { payload } = event as AppUpdateEvent;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = payload;

          // for reasons that are beyond my energy to investigate there is
          // a runtime error if you try to update the data object directly
          const previousEventVersion = all.byId[payload.id];
          if (previousEventVersion.type === "meditations")
            all.byId[payload.id] = {
              ...previousEventVersion,
              // meditations have a `second` property which cannot be `null`
              // but runs have a `seconds` property which can
              // TypeScript doesn't know that `rest` cannot have `null` `seconds` and apply to a meditation simultaneously
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...(rest as any),
              updatedAt: event.createdAt,
            };
          else
            all.byId[payload.id] = {
              ...previousEventVersion,
              ...rest,
              updatedAt: event.createdAt,
            };
          normalizedCategory.byId[payload.id] = {
            ...normalizedCategory.byId[payload.id],
            ...rest,
            updatedAt: event.createdAt,
          };
        }
      }
    }

    return normalizedCategories;
  },
);

const allNormalizedTrackedCategoriesSelector = createSelector(
  trackedCategoriesSelector,
  ({ all }) => all,
);
const allTrackedCategoryIdsOrderedByExperiencedAtSelector = createSelector(
  allNormalizedTrackedCategoriesSelector,
  ({ allIds, byId }) => {
    return allIds
      .map((id) => {
        const event = byId[id];

        return {
          id,
          experiencedAt:
            // `dateAwoke` does not include a time string which means sleeps will be sorted before all other events on a given day
            // because sort is stable, moods and sleeps will have a secondary sort on `id`
            ("experiencedAt" in event && event.experiencedAt) ||
            ("dateAwoke" in event && event.dateAwoke) ||
            id,
          type: event.type,
        };
      })
      .sort((a, b) =>
        compareFunctionForStringSorting(a.experiencedAt, b.experiencedAt),
      );
  },
);
const allIdsWithLocationOrderedByExperiencedAtSelector = createSelector(
  allTrackedCategoryIdsOrderedByExperiencedAtSelector,
  byIdSelector,
  (idsOrderedByExperiencedAt, byId) =>
    idsOrderedByExperiencedAt.filter(({ id }) => {
      const { payload } = byId[id];
      return (
        typeof payload !== "string" && "location" in payload && payload.location
      );
    }),
);

const normalizedLegRaisesSelector = createSelector(
  trackedCategoriesSelector,
  ({ "leg-raises": legRaises }) => legRaises,
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
const normalizedPushUpsSelector = createSelector(
  trackedCategoriesSelector,
  ({ "push-ups": pushUps }) => pushUps,
);
const normalizedRunsSelector = createSelector(
  trackedCategoriesSelector,
  ({ runs }) => runs,
);
const normalizedSitUpsSelector = createSelector(
  trackedCategoriesSelector,
  ({ "sit-ups": sitUps }) => sitUps,
);
const normalizedWeightsSelector = createSelector(
  trackedCategoriesSelector,
  ({ weights }) => weights,
);

const denormalize = <TrackedCategory>({
  allIds,
  byId,
}: {
  allIds: string[];
  byId: Record<string, TrackedCategory & { updatedAt?: string }>;
}) => allIds.map((id) => ({ ...byId[id], createdAt: id }));

const denormalizedMoodsSelector = createSelector(
  normalizedMoodsSelector,
  denormalize,
);

const denormalizedMoodsOrderedByExperiencedAtSelector = createSelector(
  denormalizedMoodsSelector,
  (moods): DenormalizedMoodWithExperiencedAt[] => {
    const experiencedAtToMoods = defaultDict<
      DenormalizedMoodWithExperiencedAt[]
    >(() => []);
    for (const mood of moods) {
      experiencedAtToMoods[mood.experiencedAt ?? mood.createdAt].push({
        ...mood,
        experiencedAt: mood.experiencedAt ?? mood.createdAt,
      });
    }
    // because sort is stable moods with an earlier ID will be first
    const experiencedAts = Object.keys(experiencedAtToMoods).sort(
      compareFunctionForStringSorting,
    );
    return Object.values(experiencedAts).flatMap(
      (id) => experiencedAtToMoods[id],
    );
  },
);

const moodsWithLocationOrderedByExperiencedAtSelector = createSelector(
  denormalizedMoodsOrderedByExperiencedAtSelector,
  (moods) => moods.filter((mood) => mood.location),
);

const makeMeanMoodsByPeriodSelector = (
  eachPeriodOfInterval: ({ start, end }: Interval) => Date[],
  addPeriods: (date: Date, n: number) => Date,
  createId = formatIsoDateInLocalTimezone,
) =>
  createSelector(
    denormalizedMoodsOrderedByExperiencedAtSelector,
    (moods): Record<string, number> => {
      const meanMoods: Record<string, number> = {};

      if (!moods.length) return meanMoods;

      const periods = eachPeriodOfInterval({
        start: new Date(moods[0].experiencedAt),
        end: new Date(moods[moods.length - 1].experiencedAt),
      });

      const finalPeriod = addPeriods(periods[periods.length - 1], 1);

      if (moods.length === 1) {
        meanMoods[createId(periods[0])] = moods[0].mood;
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
  const lastId = normalizedState.allIds[normalizedState.allIds.length - 1];
  return normalizedState.byId[lastId];
};

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
    const sleepByDateAwoke = defaultDict(Number);
    for (const { dateAwoke, minutesSlept } of sleeps)
      sleepByDateAwoke[dateAwoke] += minutesSlept;
    return { ...sleepByDateAwoke };
  },
);

const moodsInPeriodResultFunction = (
  { allIds, byId }: NormalizedMoods,
  dateFrom: Date,
  dateTo: Date,
): Mood[] => {
  const experiencedAtToMoods = defaultDict<Mood[]>(() => []);
  for (const id of allIds) {
    const mood = byId[id];
    experiencedAtToMoods[mood.experiencedAt ?? id].push(mood);
  }
  // because sort is stable so moods with an earlier ID will be first
  const experiencedAts = Object.keys(experiencedAtToMoods).sort(
    compareFunctionForStringSorting,
  );
  return getIdsInInterval(experiencedAts, dateFrom, dateTo).flatMap(
    (id) => experiencedAtToMoods[id],
  );
};
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

const createHasEventIdsInPeriodSelector = (
  normalizedSelector: (state: EventsState) => { allIds: string[] },
) =>
  createSelector(
    normalizedSelector,
    dateFromSelector,
    dateToSelector,
    ({ allIds }, dateFrom: Date, dateTo: Date) =>
      hasIdsInInterval(allIds, dateFrom, dateTo),
  );

const createNormalizedTotalsByMonthSelector = <T>(
  normalizedSelector: (state: EventsState) => {
    allIds: string[];
    byId: Record<string, T>;
  },
  getValue: (item: T) => number,
) =>
  createSelector(normalizedSelector, (normalizedData) => {
    const allIds: string[] = [];
    const byId: Record<string, number> = {};
    const normalizedTotals = { allIds, byId };

    if (!normalizedData.allIds.length) return normalizedTotals;

    const periods = eachMonthOfInterval({
      start: new Date(normalizedData.allIds[0]),
      end: new Date(normalizedData.allIds[normalizedData.allIds.length - 1]),
    });

    const finalPeriod = addMonths(periods[periods.length - 1], 1);

    if (normalizedData.allIds.length === 1) {
      const id = formatIsoDateInLocalTimezone(periods[0]);
      allIds.push(id);
      byId[id] = getValue(normalizedData.byId[normalizedData.allIds[0]]);
      return normalizedTotals;
    }

    periods.push(finalPeriod);

    for (let i = 1; i < periods.length; i++) {
      const p0 = periods[i - 1];
      const p1 = periods[i];
      const id = formatIsoDateInLocalTimezone(p0);
      allIds.push(id);

      let sum = 0;
      for (const id of getIdsInInterval(normalizedData.allIds, p0, p1))
        sum += getValue(normalizedData.byId[id]);
      byId[id] = sum;
    }

    return normalizedTotals;
  });

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
        .sort(compareFunctionForStringSorting);
    },
  },
  selectors: {
    allIds: allIdsSelector,
    byId: byIdSelector,
    hasEventsWithLocationInPeriod: createSelector(
      allIdsWithLocationOrderedByExperiencedAtSelector,
      dateFromSelector,
      dateToSelector,
      hasEventsInInterval,
    ),
    hasLoadedFromServer: (state: EventsState) => state.hasLoadedFromServer,
    idsToSync: (state: EventsState) => state.idsToSync,
    idsWithLocationInPeriod: createSelector(
      allIdsWithLocationOrderedByExperiencedAtSelector,
      dateFromSelector,
      dateToSelector,
      (idsOrderedByExperiencedAt, dateFrom, dateTo) =>
        getEventsInInterval(idsOrderedByExperiencedAt, dateFrom, dateTo).map(
          ({ id }) => id,
        ),
    ),
    isSyncingFromServer: (state: EventsState) => state.isSyncingFromServer,
    isSyncingToServer: (state: EventsState) => state.isSyncingToServer,
    nextCursor: (state: EventsState) => state.nextCursor,
    syncFromServerError: (state: EventsState) => state.syncFromServerError,
    syncToServerError: (state: EventsState) => state.syncToServerError,
    allNormalizedTrackedCategories: allNormalizedTrackedCategoriesSelector,
    allDenormalizedTrackedCategoriesByLocalDate: createSelector(
      allTrackedCategoryIdsOrderedByExperiencedAtSelector,
      (
        idsOrderedByExperiencedAt,
      ): Record<
        string,
        | {
            id: string;
            type: EventTypeCategories;
          }[]
        | undefined
      > => {
        const byDate = defaultDict(
          (): {
            id: string;
            type: EventTypeCategories;
          }[] => [],
        );
        for (const { experiencedAt, id, type } of idsOrderedByExperiencedAt)
          byDate[formatIsoDateInLocalTimezone(new Date(experiencedAt))].push({
            id,
            type,
          });
        return { ...byDate };
      },
    ),
    moodsWithLocationOrderedByExperiencedAt:
      moodsWithLocationOrderedByExperiencedAtSelector,
    moodsWithLocationOrderedByExperiencedAtInPeriod: createSelector(
      moodsWithLocationOrderedByExperiencedAtSelector,
      dateFromSelector,
      dateToSelector,
      getEventsInInterval,
    ),
    denormalizedMeditations: createSelector(
      normalizedMeditationsSelector,
      denormalize,
    ),
    denormalizedLegRaises: createSelector(
      normalizedLegRaisesSelector,
      denormalize,
    ),
    denormalizedMoodsOrderedByExperiencedAt:
      denormalizedMoodsOrderedByExperiencedAtSelector,
    denormalizedPushUps: createSelector(normalizedPushUpsSelector, denormalize),
    denormalizedRuns: createSelector(normalizedRunsSelector, denormalize),
    denormalizedSitUps: createSelector(normalizedSitUpsSelector, denormalize),
    denormalizedSleeps: denormalizedSleepsSelector,
    denormalizedWeights: createSelector(normalizedWeightsSelector, denormalize),
    envelopingDenormalizedMoodsOrderedByExperiencedAt: createSelector(
      denormalizedMoodsOrderedByExperiencedAtSelector,
      dateFromSelector,
      dateToSelector,
      getEnvelopingEvents,
    ),
    envelopingWeightIds: createSelector(
      normalizedWeightsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds }, dateFrom, dateTo) =>
        getEnvelopingIds(allIds, dateFrom, dateTo),
    ),
    envelopingIdsWithLocation: createSelector(
      allIdsWithLocationOrderedByExperiencedAtSelector,
      dateFromSelector,
      dateToSelector,
      (idsWithLocationOrderedByExperiencedAt, dateFrom, dateTo) =>
        getEnvelopingEvents(
          idsWithLocationOrderedByExperiencedAt,
          dateFrom,
          dateTo,
        ).map(({ id }) => id),
    ),
    hasMoods: createSelector(normalizedMoodsSelector, normalizedStateNotEmpty),
    hasMoodsInPeriod: createSelector(
      denormalizedMoodsOrderedByExperiencedAtSelector,
      dateFromSelector,
      dateToSelector,
      hasEventsInInterval,
    ),
    hasLegRaises: createSelector(
      normalizedLegRaisesSelector,
      normalizedStateNotEmpty,
    ),
    hasMeditations: createSelector(
      normalizedMeditationsSelector,
      normalizedStateNotEmpty,
    ),
    hasMeditationsInPeriod: createHasEventIdsInPeriodSelector(
      normalizedMeditationsSelector,
    ),
    hasPushUps: createSelector(
      normalizedPushUpsSelector,
      normalizedStateNotEmpty,
    ),
    hasPushUpsInPeriod: createHasEventIdsInPeriodSelector(
      normalizedPushUpsSelector,
    ),
    hasRuns: createSelector(normalizedRunsSelector, normalizedStateNotEmpty),
    hasRunDistanceInPeriod: createSelector(
      normalizedRunsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds, byId }, dateFrom: Date, dateTo: Date) =>
        getIdsInInterval(allIds, dateFrom, dateTo).some(
          (id) => byId[id].meters,
        ),
    ),
    hasSitUps: createSelector(
      normalizedSitUpsSelector,
      normalizedStateNotEmpty,
    ),
    hasSleeps: createSelector(
      normalizedSleepsSelector,
      normalizedStateNotEmpty,
    ),
    hasSleepsInPeriod: createHasEventIdsInPeriodSelector(
      normalizedSleepsSelector,
    ),
    hasWeights: createSelector(
      normalizedWeightsSelector,
      normalizedStateNotEmpty,
    ),
    hasWeightsInPeriod: createHasEventIdsInPeriodSelector(
      normalizedWeightsSelector,
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
        const minutesSleptArray: number[] = [];
        for (let date = dateFrom; date < dateTo; date = addDays(date, 1)) {
          const minutesSlept =
            minutesSleptByDateAwoke[formatIsoDateInLocalTimezone(date)];
          if (minutesSlept === undefined) continue;
          minutesSleptArray.push(minutesSlept);
        }
        return computeMeanSafe(minutesSleptArray);
      },
    ),
    meanMinutesSleptByMonth: createSelector(
      minutesSleptByDateAwokeSelector,
      (minutesSleptByDateAwoke) => {
        const sleepsByMonth = defaultDict((): number[] => []);
        for (const [date, minutesSlept] of Object.entries(
          minutesSleptByDateAwoke,
        ))
          sleepsByMonth[date.slice(0, 7)].push(minutesSlept);
        return Object.fromEntries(
          Object.entries(sleepsByMonth).map(([month, sleeps]) => [
            month,
            computeMean(sleeps),
          ]),
        );
      },
    ),
    minutesSleptByDateAwoke: minutesSleptByDateAwokeSelector,
    meanWeightInPeriod: createSelector(
      normalizedWeightsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds, byId }, dateFrom: Date, dateTo: Date) =>
        computeMeanSafe(
          getIdsInInterval(allIds, dateFrom, dateTo).map(
            (id) => byId[id].value,
          ),
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
      ): Record<string, number> | undefined => {
        const moodsInPeriod = moodsInPeriodResultFunction(
          normalizedMoods,
          dateFrom,
          dateTo,
        );

        const words = defaultDict(Number);
        for (const { description, exploration } of moodsInPeriod) {
          if (description)
            for (const w of getNormalizedWordCloudWords(description))
              words[w] += 1;
          if (exploration)
            for (const w of getNormalizedWordCloudWords(exploration))
              words[w] += 1;
        }

        return Object.keys(words).length < MINIMUM_WORD_CLOUD_WORDS
          ? undefined
          : { ...words };
      },
    ),
    // some code may depend on the fact that the array
    // value in the returned object cannot be empty
    moodIdsByDate: createSelector(
      denormalizedMoodsOrderedByExperiencedAtSelector,
      (moods): Record<string, string[]> => {
        const moodsByDate = defaultDict((): string[] => []);
        for (const { createdAt, experiencedAt } of moods)
          moodsByDate[
            formatIsoDateInLocalTimezone(new Date(experiencedAt))
          ].push(createdAt);
        return { ...moodsByDate };
      },
    ),
    moodsInPeriod: createSelector(
      normalizedMoodsSelector,
      dateFromSelector,
      dateToSelector,
      moodsInPeriodResultFunction,
    ),
    normalizedLegRaises: normalizedLegRaisesSelector,
    normalizedMeditations: normalizedMeditationsSelector,
    normalizedMoods: normalizedMoodsSelector,
    normalizedPushUps: normalizedPushUpsSelector,
    normalizedRuns: normalizedRunsSelector,
    normalizedSitUps: normalizedSitUpsSelector,
    normalizedSleeps: normalizedSleepsSelector,
    normalizedSleepsSortedByDateAwoke: createSelector(
      normalizedSleepsSelector,
      (normalizedSleeps) => ({
        ...normalizedSleeps,
        // sorting is stable so 2 events with same dateAwoke will be ordered by event id
        allIds: normalizedSleeps.allIds.toSorted((a, b) =>
          compareFunctionForStringSorting(
            normalizedSleeps.byId[a].dateAwoke,
            normalizedSleeps.byId[b].dateAwoke,
          ),
        ),
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
    normalizedTotalPushUpsByMonth: createNormalizedTotalsByMonthSelector(
      normalizedPushUpsSelector,
      (item) => item.value,
    ),
    normalizedTotalRunDistanceByMonth: createNormalizedTotalsByMonthSelector(
      normalizedRunsSelector,
      (item) => item.meters ?? 0,
    ),
    normalizedTotalSecondsMeditatedByMonth:
      createNormalizedTotalsByMonthSelector(
        normalizedMeditationsSelector,
        (item) => item.seconds,
      ),
    runMetersInPeriod: createSelector(
      normalizedRunsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds, byId }, dateFrom: Date, dateTo: Date): number => {
        let sum = 0;
        for (const id of getIdsInInterval(allIds, dateFrom, dateTo)) {
          const { meters } = byId[id];
          if (meters) sum += meters;
        }
        return sum;
      },
    ),
    runSecondsInPeriod: createSelector(
      normalizedRunsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds, byId }, dateFrom: Date, dateTo: Date): number => {
        let sum = 0;
        for (const id of getIdsInInterval(allIds, dateFrom, dateTo)) {
          const { seconds } = byId[id];
          if (seconds) sum += seconds;
        }
        return sum;
      },
    ),
    secondsMeditatedInPeriod: createSelector(
      normalizedMeditationsSelector,
      dateFromSelector,
      dateToSelector,
      secondsMeditatedInPeriodResultFunction,
    ),
    totalLegRaisesInPeriod: createSelector(
      normalizedLegRaisesSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds, byId }, dateFrom: Date, dateTo: Date) =>
        getIdsInInterval(allIds, dateFrom, dateTo)
          .map((id) => byId[id].value)
          .reduce((a, b) => a + b, 0),
    ),
    totalPushUpsInPeriod: createSelector(
      normalizedPushUpsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds, byId }, dateFrom: Date, dateTo: Date) =>
        getIdsInInterval(allIds, dateFrom, dateTo)
          .map((id) => byId[id].value)
          .reduce((a, b) => a + b, 0),
    ),
    totalSitUpsInPeriod: createSelector(
      normalizedSitUpsSelector,
      dateFromSelector,
      dateToSelector,
      ({ allIds, byId }, dateFrom: Date, dateTo: Date) =>
        getIdsInInterval(allIds, dateFrom, dateTo)
          .map((id) => byId[id].value)
          .reduce((a, b) => a + b, 0),
    ),
  },
});
