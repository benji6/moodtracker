import { createSelector } from "@reduxjs/toolkit";
import addHours from "date-fns/addHours";
import addMonths from "date-fns/addMonths";
import addWeeks from "date-fns/addWeeks";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import getHours from "date-fns/getHours";
import set from "date-fns/set";
import subHours from "date-fns/subHours";
import { HOURS_PER_DAY } from "./constants";
import { dateWeekdayFormatter, WEEK_OPTIONS } from "./formatters";
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
            // eslint-disable-next-line no-console
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
          const { id: _, ...serverMood } = event.payload;

          // for reasons that are beyond my energy to investigate there is
          // a runtime error if you try to update the mood object directly
          byId[event.payload.id] = {
            ...currentMood,
            ...serverMood,
            updatedAt: event.createdAt,
          };
        }
      }
    }

    return { allIds, byId };
  }
);

const NUMBER_OF_DAYS_TO_AVERAGE_OVER = 7;
type HourAverages = [number, number][];
export const averageByHourSelector = createSelector(moodsSelector, (moods): {
  averages: HourAverages;
  daysUsed: number;
} => {
  let daysUsed = 0;
  const startDate = subHours(
    set(new Date(), {
      milliseconds: 0,
      minutes: 30,
      seconds: 0,
    }),
    1
  );
  const averages: HourAverages = Array(HOURS_PER_DAY);

  for (let n = 0; n < HOURS_PER_DAY; n++) {
    let sumOfAverageMoods = 0;
    let i = 0;

    for (; i < NUMBER_OF_DAYS_TO_AVERAGE_OVER; i++) {
      const fromDate = subHours(startDate, n + HOURS_PER_DAY * i);
      const averageMoodInInterval = computeAverageMoodInInterval(
        moods,
        fromDate,
        addHours(fromDate, 1)
      );
      if (averageMoodInInterval === undefined) break;
      sumOfAverageMoods += averageMoodInInterval;
    }

    daysUsed = Math.max(daysUsed, i);

    if (i) {
      const hours = getHours(subHours(startDate, n));
      averages[hours] = [hours, sumOfAverageMoods / i];
    }
  }

  return { averages: averages.filter((x) => x !== undefined), daysUsed };
});

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
    const averageMoodInInterval = computeAverageMoodInInterval(
      moods,
      month0,
      month1
    );
    if (averageMoodInInterval !== undefined)
      averageByMonth.push([month0, averageMoodInInterval]);
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
    const averageMoodInInterval = computeAverageMoodInInterval(
      moods,
      week0,
      week1
    );
    if (averageMoodInInterval !== undefined)
      averageByWeek.push([week0, averageMoodInInterval]);
  }

  return averageByWeek;
});

export const groupMoodsByDaySelector = createSelector(moodsSelector, (moods): [
  string,
  string[]
][] => {
  const moodsGroupedByDate: { [date: string]: string[] } = {};

  for (const id of moods.allIds) {
    const key = dateWeekdayFormatter.format(new Date(id));
    if (moodsGroupedByDate[key]) moodsGroupedByDate[key].push(id);
    else moodsGroupedByDate[key] = [id];
  }

  return Object.entries(moodsGroupedByDate);
});
