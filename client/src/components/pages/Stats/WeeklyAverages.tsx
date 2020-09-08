import { startOfWeek, endOfWeek, eachWeekOfInterval, addWeeks } from "date-fns";
import * as React from "react";
import { Paper } from "eri";
import { StateContext } from "../../AppState";
import { mapRight, computeAverageMoodInInterval } from "../../../utils";
import { NormalizedMoods } from "../../../types";
import MoodCell from "./MoodCell";

const WEEK_OPTIONS = {
  weekStartsOn: 1,
} as const;

const weekFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// TODO: One day we should be able to remove this
const formatRange = (dateA: Date, dateB: Date) =>
  "formatRange" in weekFormatter
    ? (weekFormatter as any).formatRange(dateA, dateB)
    : `${weekFormatter.format(dateA)} – ${weekFormatter.format(dateB)}`;

const createKey = (week: Date): string =>
  formatRange(startOfWeek(week, WEEK_OPTIONS), endOfWeek(week, WEEK_OPTIONS));

export const computeAverageByWeek = (
  moods: NormalizedMoods
): [string, number][] => {
  const averageByWeek: [string, number][] = [];

  const weeks = eachWeekOfInterval(
    {
      start: new Date(moods.allIds[0]),
      end: new Date(moods.allIds[moods.allIds.length - 1]),
    },
    WEEK_OPTIONS
  );

  if (moods.allIds.length === 1) {
    return [[createKey(weeks[0]), moods.byId[moods.allIds[0]].mood]];
  }

  weeks.push(addWeeks(weeks[weeks.length - 1], 1));

  for (let i = 1; i < weeks.length; i++) {
    const week0 = weeks[i - 1];
    const week1 = weeks[i];

    averageByWeek.push([
      createKey(week0),
      computeAverageMoodInInterval(moods, week0, week1),
    ]);
  }

  return averageByWeek;
};

export default function WeeklyAverages() {
  const state = React.useContext(StateContext);
  const averageByWeek = React.useMemo(() => computeAverageByWeek(state.moods), [
    state.moods,
  ]);

  return (
    <Paper>
      <h2>Weekly averages</h2>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {mapRight(averageByWeek, ([week, averageMood]) => (
            <tr key={week}>
              <td>{week}</td>
              <MoodCell mood={averageMood} />
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  );
}
