import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AppCreateEvent,
  AppEvent,
  AppUpdateEvent,
  EventTypeTuple,
  NormalizedMeditations,
  NormalizedMoods,
  NormalizedWeights,
} from "../types";
import { captureException } from "../sentry";
import {
  computeAverageMoodInInterval,
  computeSecondsMeditatedInInterval,
  formatIsoDateHourInLocalTimezone,
  formatIsoDateInLocalTimezone,
  getNormalizedTagsFromDescription,
} from "../utils";
import {
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
  Interval,
} from "date-fns";
import { WEEK_OPTIONS } from "../formatters/dateTimeFormatters";

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

const trackedCategoriesSelector = createSelector(
  allIdsSelector,
  byIdSelector,
  (
    allIds,
    byId,
  ): {
    meditations: NormalizedMeditations;
    moods: NormalizedMoods;
    weights: NormalizedWeights;
  } => {
    const normalizedCategories: {
      meditations: NormalizedMeditations;
      moods: NormalizedMoods;
      weights: NormalizedWeights;
    } = {
      meditations: { allIds: [], byId: {} },
      moods: { allIds: [], byId: {} },
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
  ({ meditations }): NormalizedMeditations => meditations,
);

const normalizedMoodsSelector = createSelector(
  trackedCategoriesSelector,
  ({ moods }): NormalizedMoods => moods,
);

const normalizedWeightsSelector = createSelector(
  trackedCategoriesSelector,
  ({ weights }): NormalizedWeights => weights,
);

const makeNormalizedAveragesByPeriodSelector = (
  eachPeriodOfInterval: ({ start, end }: Interval) => Date[],
  addPeriods: (date: Date, n: number) => Date,
  createId = formatIsoDateInLocalTimezone,
) =>
  createSelector(
    normalizedMoodsSelector,
    (
      moods,
    ): {
      allIds: string[];
      byId: { [k: string]: number | undefined };
    } => {
      const allIds: string[] = [];
      const byId: { [k: string]: number } = {};
      const normalizedAverages = { allIds, byId };

      if (!moods.allIds.length) return normalizedAverages;

      const periods = eachPeriodOfInterval({
        start: new Date(moods.allIds[0]),
        end: new Date(moods.allIds.at(-1)!),
      });

      const finalPeriod = addPeriods(periods.at(-1)!, 1);

      if (moods.allIds.length === 1) {
        const id = createId(periods[0]);
        allIds.push(id);
        byId[id] = moods.byId[moods.allIds[0]].mood;
        return normalizedAverages;
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
        if (averageMoodInInterval !== undefined) {
          const id = createId(p0);
          allIds.push(id);
          byId[id] = averageMoodInInterval;
        }
      }

      return normalizedAverages;
    },
  );

const getLastEvent = (normalizedState: EventsState): AppEvent => {
  if (!normalizedState.allIds.length)
    throw Error("Error: `allIds` must have length > 0");
  const lastId = normalizedState.allIds.at(-1)!;
  return normalizedState.byId[lastId];
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
    isSyncingFromServer: (state: EventsState) => state.isSyncingFromServer,
    isSyncingToServer: (state: EventsState) => state.isSyncingToServer,
    nextCursor: (state: EventsState) => state.nextCursor,
    syncFromServerError: (state: EventsState) => state.syncFromServerError,
    syncToServerError: (state: EventsState) => state.syncToServerError,
    allIdsWithLocation: createSelector(
      allIdsSelector,
      byIdSelector,
      (allIds, byId) =>
        allIds.filter((id) => {
          const { payload } = byId[id];
          return (
            typeof payload !== "string" &&
            "location" in payload &&
            payload.location
          );
        }),
    ),
    moodIdsWithLocation: createSelector(
      normalizedMoodsSelector,
      ({ allIds, byId }): string[] =>
        allIds.filter((id) => {
          const mood = byId[id];
          return "location" in mood && mood.location;
        }),
    ),
    denormalizedMeditations: createSelector(
      normalizedMeditationsSelector,
      ({ allIds, byId }) =>
        allIds.map((id) => ({ ...byId[id], createdAt: id })),
    ),
    denormalizedMoods: createSelector(
      normalizedMoodsSelector,
      ({ allIds, byId }) =>
        allIds.map((id) => ({ ...byId[id], createdAt: id })),
    ),
    denormalizedWeights: createSelector(
      normalizedWeightsSelector,
      ({ allIds, byId }) =>
        allIds.map((id) => ({ ...byId[id], createdAt: id })),
    ),
    hasMoods: createSelector(normalizedMoodsSelector, ({ allIds }) =>
      Boolean(allIds.length),
    ),
    hasMeditations: createSelector(
      normalizedMeditationsSelector,
      ({ allIds }) => Boolean(allIds.length),
    ),
    hasWeights: createSelector(normalizedWeightsSelector, ({ allIds }) =>
      Boolean(allIds.length),
    ),

    // some code may depend on the fact that the array
    // value in the returned object cannot be empty
    moodIdsByDate: createSelector(
      normalizedMoodsSelector,
      ({ allIds }): { [date: string]: string[] | undefined } => {
        const moodsGroupedByDate: { [date: string]: string[] } = {};

        for (let i = 0; i < allIds.length; i++) {
          const id = allIds[i];
          const key = formatIsoDateInLocalTimezone(new Date(id));
          if (moodsGroupedByDate[key]) moodsGroupedByDate[key].push(id);
          else moodsGroupedByDate[key] = [id];
        }

        return moodsGroupedByDate;
      },
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
    normalizedWeights: normalizedWeightsSelector,
    normalizedAveragesByDay: makeNormalizedAveragesByPeriodSelector(
      eachDayOfInterval,
      addDays,
    ),
    normalizedAveragesByHour: makeNormalizedAveragesByPeriodSelector(
      eachHourOfInterval,
      addHours,
      formatIsoDateHourInLocalTimezone,
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
          byId[id] = computeSecondsMeditatedInInterval(
            normalizedMeditations,
            p0,
            p1,
          );
        }

        return normalizedTotalSeconds;
      },
    ),
    normalizedAveragesByMonth: makeNormalizedAveragesByPeriodSelector(
      eachMonthOfInterval,
      addMonths,
    ),
    normalizedAveragesByWeek: makeNormalizedAveragesByPeriodSelector(
      ({ start, end }: Interval) =>
        eachWeekOfInterval({ start, end }, WEEK_OPTIONS),
      addWeeks,
    ),
    normalizedAveragesByYear: makeNormalizedAveragesByPeriodSelector(
      eachYearOfInterval,
      addYears,
    ),
  },
});
