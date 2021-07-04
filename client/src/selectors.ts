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
import { WEEK_OPTIONS } from "./dateTimeFormatters";
import { RootState } from "./store";
import { NormalizedMeditations, NormalizedMoods } from "./types";
import {
  computeAverageMoodInInterval,
  formatIsoDateHourInLocalTimezone,
  formatIsoDateInLocalTimezone,
  getNormalizedTagsFromDescription,
  isoDateFromIsoDateAndTime,
} from "./utils";

export const appIsStorageLoadingSelector = (state: RootState) =>
  state.app.isStorageLoading;
export const eventsIsSyncingFromServerSelector = (state: RootState) =>
  state.events.isSyncingFromServer;
export const eventsIsSyncingToServerSelector = (state: RootState) =>
  state.events.isSyncingToServer;
export const eventsSyncFromServerErrorSelector = (state: RootState) =>
  state.events.syncFromServerError;
export const eventsSyncToServerErrorSelector = (state: RootState) =>
  state.events.syncToServerError;
export const eventsSelector = (state: RootState) => state.events;
export const userEmailSelector = (state: RootState) => state.user.email;
export const userIdSelector = (state: RootState) => state.user.id;
export const userIsSignedInSelector = (state: RootState) =>
  Boolean(state.user.email);
export const userLoadingSelector = (state: RootState) => state.user.loading;

const trackedCategoriesSelector = createSelector(
  eventsSelector,
  (events): { meditations: NormalizedMeditations; moods: NormalizedMoods } => {
    const meditations: NormalizedMeditations = { allIds: [], byId: {} };
    const moods: NormalizedMoods = { allIds: [], byId: {} };

    for (const id of events.allIds) {
      const event = events.byId[id];

      switch (event.type) {
        case "v1/meditations/create":
          meditations.allIds.push(event.createdAt);
          meditations.byId[event.createdAt] = event.payload;
          break;
        case "v1/meditations/delete": {
          let index: undefined | number;
          let i = moods.allIds.length;

          while (i--)
            if (meditations.allIds[i] === event.payload) {
              index = i;
              break;
            }

          if (index === undefined) {
            // eslint-disable-next-line no-console
            console.error(
              `Delete event error - could not find meditation to delete: ${JSON.stringify(
                event
              )}`
            );
            break;
          }

          meditations.allIds.splice(index, 1);
          delete meditations.byId[event.payload];
          break;
        }
        case "v1/moods/create":
          moods.allIds.push(event.createdAt);
          moods.byId[event.createdAt] = event.payload;
          break;
        case "v1/moods/delete": {
          let index: undefined | number;
          let i = moods.allIds.length;

          while (i--)
            if (moods.allIds[i] === event.payload) {
              index = i;
              break;
            }

          if (index === undefined) {
            // eslint-disable-next-line no-console
            console.error(
              `Delete event error - could not find mood to delete: ${JSON.stringify(
                event
              )}`
            );
            break;
          }

          moods.allIds.splice(index, 1);
          delete moods.byId[event.payload];
          break;
        }
        case "v1/moods/update": {
          const currentMood = moods.byId[event.payload.id];
          const { id: _, ...serverMood } = event.payload;

          // for reasons that are beyond my energy to investigate there is
          // a runtime error if you try to update the mood object directly
          moods.byId[event.payload.id] = {
            ...currentMood,
            ...serverMood,
            updatedAt: event.createdAt,
          };
        }
      }
    }

    return { meditations, moods };
  }
);

export const normalizedMeditationsSelector = createSelector(
  trackedCategoriesSelector,
  ({ meditations }): NormalizedMeditations => meditations
);

export const normalizedMoodsSelector = createSelector(
  trackedCategoriesSelector,
  ({ moods }): NormalizedMoods => moods
);

export const denormalizedMeditationsSelector = createSelector(
  normalizedMeditationsSelector,
  ({ allIds, byId }) => allIds.map((id) => ({ ...byId[id], createdAt: id }))
);

export const denormalizedMoodsSelector = createSelector(
  normalizedMoodsSelector,
  ({ allIds, byId }) => allIds.map((id) => ({ ...byId[id], createdAt: id }))
);

export const hasMeditationsSelector = createSelector(
  normalizedMeditationsSelector,
  ({ allIds }) => Boolean(allIds.length)
);

// some code may depend on the fact that the array
// value in the returned object cannot be empty
export const moodIdsByDateSelector = createSelector(
  normalizedMoodsSelector,
  ({ allIds }): { [date: string]: string[] | undefined } => {
    const moodsGroupedByDate: { [date: string]: string[] } = {};

    for (let i = 0; i < allIds.length; i++) {
      const id = allIds[i];
      const key = isoDateFromIsoDateAndTime(id);
      if (moodsGroupedByDate[key]) moodsGroupedByDate[key].push(id);
      else moodsGroupedByDate[key] = [id];
    }

    return moodsGroupedByDate;
  }
);

const makeNormalizedAveragesByPeriodSelector = (
  eachPeriodOfInterval: ({ start, end }: Interval) => Date[],
  addPeriods: (date: Date, n: number) => Date,
  createId = formatIsoDateInLocalTimezone
) =>
  createSelector(
    normalizedMoodsSelector,
    (
      moods
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
        end: new Date(moods.allIds[moods.allIds.length - 1]),
      });

      const finalPeriod = addPeriods(periods[periods.length - 1], 1);

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
          p1
        );
        if (averageMoodInInterval !== undefined) {
          const id = createId(p0);
          allIds.push(id);
          byId[id] = averageMoodInInterval;
        }
      }

      return normalizedAverages;
    }
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
  }
);

export const normalizedAveragesByDaySelector =
  makeNormalizedAveragesByPeriodSelector(eachDayOfInterval, addDays);

export const normalizedAveragesByHourSelector =
  makeNormalizedAveragesByPeriodSelector(
    eachHourOfInterval,
    addHours,
    formatIsoDateHourInLocalTimezone
  );

export const normalizedAveragesByMonthSelector =
  makeNormalizedAveragesByPeriodSelector(eachMonthOfInterval, addMonths);

export const normalizedAveragesByWeekSelector =
  makeNormalizedAveragesByPeriodSelector(
    ({ start, end }: Interval) =>
      eachWeekOfInterval({ start, end }, WEEK_OPTIONS),
    addWeeks
  );

export const normalizedAveragesByYearSelector =
  makeNormalizedAveragesByPeriodSelector(eachYearOfInterval, addYears);
