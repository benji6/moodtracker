import { createSelector } from "@reduxjs/toolkit";
import {
  addMonths,
  addWeeks,
  eachMonthOfInterval,
  eachWeekOfInterval,
} from "date-fns";
import { WEEK_OPTIONS } from "./formatters";
import { RootState } from "./store";
import { NormalizedMoods } from "./types";
import { computeAverageMoodInInterval } from "./utils";

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

export const moodsSelector = createSelector(
  eventsSelector,
  (events): NormalizedMoods => {
    const allIds: NormalizedMoods["allIds"] = [];
    const byId: NormalizedMoods["byId"] = {};

    for (const id of events.allIds) {
      const event = events.byId[id];

      switch (event.type) {
        case "v1/moods/create":
          allIds.push(event.createdAt);
          byId[event.createdAt] = event.payload;
          break;
        case "v1/moods/delete": {
          let index: undefined | number;
          let i = allIds.length;

          while (i--)
            if (allIds[i] === event.payload) {
              index = i;
              break;
            }

          if (index === undefined) {
            console.error(
              `Delete event error - could not find mood to delete: ${JSON.stringify(
                event
              )}`
            );
            break;
          }

          allIds.splice(index, 1);
          delete byId[event.payload];
          break;
        }
        case "v1/moods/update": {
          const currentMood = byId[event.payload.id];

          // for reasons that are beyond my energy to investigate there is
          // a runtime error if you try to update the mood object directly
          byId[event.payload.id] = {
            ...currentMood,
            mood: event.payload.mood,
            updatedAt: event.createdAt,
          };
        }
      }
    }

    return { allIds, byId };
  }
);

export const averageByMonthSelector = createSelector(moodsSelector, (moods): [
  Date,
  number
][] => {
  const averageByMonth: [Date, number][] = [];

  const months = eachMonthOfInterval({
    start: new Date(moods.allIds[0]),
    end: new Date(moods.allIds[moods.allIds.length - 1]),
  });

  const finalMonth = addMonths(months[months.length - 1], 1);

  if (moods.allIds.length === 1) {
    return [[months[0], moods.byId[moods.allIds[0]].mood]];
  }

  months.push(finalMonth);

  for (let i = 1; i < months.length; i++) {
    const month0 = months[i - 1];
    const month1 = months[i];

    averageByMonth.push([
      month0,
      computeAverageMoodInInterval(moods, month0, month1),
    ]);
  }

  return averageByMonth;
});

export const averageByWeekSelector = createSelector(moodsSelector, (moods): [
  Date,
  number
][] => {
  const averageByWeek: [Date, number][] = [];

  const weeks = eachWeekOfInterval(
    {
      start: new Date(moods.allIds[0]),
      end: new Date(moods.allIds[moods.allIds.length - 1]),
    },
    WEEK_OPTIONS
  );

  if (moods.allIds.length === 1) {
    return [[weeks[0], moods.byId[moods.allIds[0]].mood]];
  }

  weeks.push(addWeeks(weeks[weeks.length - 1], 1));

  for (let i = 1; i < weeks.length; i++) {
    const week0 = weeks[i - 1];
    const week1 = weeks[i];

    averageByWeek.push([
      week0,
      computeAverageMoodInInterval(moods, week0, week1),
    ]);
  }

  return averageByWeek;
});
