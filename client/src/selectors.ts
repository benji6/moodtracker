import { createSelector } from "@reduxjs/toolkit";
import addDays from "date-fns/addDays";
import addHours from "date-fns/addHours";
import addMonths from "date-fns/addMonths";
import addWeeks from "date-fns/addWeeks";
import addYears from "date-fns/addYears";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import eachHourOfInterval from "date-fns/eachHourOfInterval";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import eachYearOfInterval from "date-fns/eachYearOfInterval";
import { WEEK_OPTIONS } from "./formatters/dateTimeFormatters";
import { captureException } from "./sentry";
import { RootState } from "./store";
import {
  AppCreateEvent,
  AppUpdateEvent,
  EventTypeTuple,
  NormalizedMeditations,
  NormalizedMoods,
  NormalizedWeights,
} from "./types";
import {
  computeAverageMoodInInterval,
  formatIsoDateHourInLocalTimezone,
  formatIsoDateInLocalTimezone,
  getNormalizedTagsFromDescription,
} from "./utils";

export const appIsStorageLoadingSelector = (state: RootState) =>
  state.app.isStorageLoading;
export const appShowNewSignInUiSelector = (state: RootState) =>
  state.app.showNewSignInUi;
export const deviceGeolocationSelector = (state: RootState) =>
  state.device.geolocation;
export const eventsAllIdsSelector = (state: RootState) => state.events.allIds;
export const eventsByIdSelector = (state: RootState) => state.events.byId;
export const eventsHasLoadedFromServerSelector = (state: RootState) =>
  state.events.hasLoadedFromServer;
export const eventsIdsToSyncSelector = (state: RootState) =>
  state.events.idsToSync;
export const eventsIsSyncingFromServerSelector = (state: RootState) =>
  state.events.isSyncingFromServer;
export const eventsIsSyncingToServerSelector = (state: RootState) =>
  state.events.isSyncingToServer;
export const eventsNextCursorSelector = (state: RootState) =>
  state.events.nextCursor;
export const eventsSyncFromServerErrorSelector = (state: RootState) =>
  state.events.syncFromServerError;
export const eventsSyncToServerErrorSelector = (state: RootState) =>
  state.events.syncToServerError;
export const settingsDataSelector = (state: RootState) => state.settings.data;
export const settingsRecordLocationSelector = (state: RootState) =>
  state.settings.data?.recordLocation;
export const userEmailSelector = (state: RootState) => state.user.email;
export const userIdSelector = (state: RootState) => state.user.id;
export const userIsSignedInSelector = (state: RootState) =>
  Boolean(state.user.email);
export const userLoadingSelector = (state: RootState) => state.user.loading;

export const eventsAllIdsWithLocationSelector = createSelector(
  eventsAllIdsSelector,
  eventsByIdSelector,
  (allIds, byId) =>
    allIds.filter((id) => {
      const { payload } = byId[id];
      return (
        typeof payload !== "string" && "location" in payload && payload.location
      );
    }),
);

const trackedCategoriesSelector = createSelector(
  eventsAllIdsSelector,
  eventsByIdSelector,
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

export const normalizedMeditationsSelector = createSelector(
  trackedCategoriesSelector,
  ({ meditations }): NormalizedMeditations => meditations,
);

export const normalizedMoodsSelector = createSelector(
  trackedCategoriesSelector,
  ({ moods }): NormalizedMoods => moods,
);

export const moodIdsWithLocationSelector = createSelector(
  normalizedMoodsSelector,
  ({ allIds, byId }): string[] =>
    allIds.filter((id) => {
      const mood = byId[id];
      return "location" in mood && mood.location;
    }),
);

export const normalizedWeightsSelector = createSelector(
  trackedCategoriesSelector,
  ({ weights }): NormalizedWeights => weights,
);

export const denormalizedMeditationsSelector = createSelector(
  normalizedMeditationsSelector,
  ({ allIds, byId }) => allIds.map((id) => ({ ...byId[id], createdAt: id })),
);
export const denormalizedMoodsSelector = createSelector(
  normalizedMoodsSelector,
  ({ allIds, byId }) => allIds.map((id) => ({ ...byId[id], createdAt: id })),
);
export const denormalizedWeightsSelector = createSelector(
  normalizedWeightsSelector,
  ({ allIds, byId }) => allIds.map((id) => ({ ...byId[id], createdAt: id })),
);

export const hasMoodsSelector = createSelector(
  normalizedMoodsSelector,
  ({ allIds }) => Boolean(allIds.length),
);
export const hasMeditationsSelector = createSelector(
  normalizedMeditationsSelector,
  ({ allIds }) => Boolean(allIds.length),
);
export const hasWeightsSelector = createSelector(
  normalizedWeightsSelector,
  ({ allIds }) => Boolean(allIds.length),
);

// some code may depend on the fact that the array
// value in the returned object cannot be empty
export const moodIdsByDateSelector = createSelector(
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

export const normalizedDescriptionWordsSelector = createSelector(
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
);

export const normalizedAveragesByDaySelector =
  makeNormalizedAveragesByPeriodSelector(eachDayOfInterval, addDays);

export const normalizedAveragesByHourSelector =
  makeNormalizedAveragesByPeriodSelector(
    eachHourOfInterval,
    addHours,
    formatIsoDateHourInLocalTimezone,
  );

export const normalizedAveragesByMonthSelector =
  makeNormalizedAveragesByPeriodSelector(eachMonthOfInterval, addMonths);

export const normalizedAveragesByWeekSelector =
  makeNormalizedAveragesByPeriodSelector(
    ({ start, end }: Interval) =>
      eachWeekOfInterval({ start, end }, WEEK_OPTIONS),
    addWeeks,
  );

export const normalizedAveragesByYearSelector =
  makeNormalizedAveragesByPeriodSelector(eachYearOfInterval, addYears);
