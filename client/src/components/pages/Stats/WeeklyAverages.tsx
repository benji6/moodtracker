import { startOfWeek, eachWeekOfInterval, addWeeks } from "date-fns";
import * as React from "react";
import { Paper } from "eri";
import {
  mapRight,
  computeAverageMoodInInterval,
  formatIsoDateInLocalTimezone,
} from "../../../utils";
import { NormalizedMoods } from "../../../types";
import MoodCell from "./MoodCell";
import { Link } from "@reach/router";
import { formatWeek, WEEK_OPTIONS } from "../../../formatters";
import { moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";

export const computeAverageByWeek = (
  moods: NormalizedMoods
): [Date, number][] => {
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
};

export default function WeeklyAverages() {
  const moods = useSelector(moodsSelector);
  const averageByWeek = React.useMemo(() => computeAverageByWeek(moods), [
    moods,
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
          {mapRight(averageByWeek, ([week, averageMood]) => {
            const weekStr = formatWeek(week);
            return (
              <tr key={weekStr}>
                <td>
                  <Link
                    to={`weeks/${formatIsoDateInLocalTimezone(
                      startOfWeek(week, WEEK_OPTIONS)
                    )}`}
                  >
                    {weekStr}
                  </Link>
                </td>
                <MoodCell mood={averageMood} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </Paper>
  );
}
