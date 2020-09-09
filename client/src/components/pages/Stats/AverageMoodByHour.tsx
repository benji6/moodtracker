import * as React from "react";
import { Paper } from "eri";
import MoodCell from "./MoodCell";
import { subHours, addHours, getHours, set } from "date-fns";
import { computeAverageMoodInInterval } from "../../../utils";
import { StateContext } from "../../AppState";
import { NormalizedMoods } from "../../../types";

const HOURS_PER_DAY = 24;
const NUMBER_OF_DAYS_TO_AVERAGE_OVER = 7;
const formatter = Intl.DateTimeFormat(undefined, { hour: "numeric" });

type Averages = [
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined]
];

const computeAverages = (
  moods: NormalizedMoods
): { averages: Averages; daysUsed: number } => {
  let daysUsed = 0;
  const startDate = subHours(
    set(new Date(), {
      milliseconds: 0,
      minutes: 0,
      seconds: 0,
    }),
    1
  );
  const averages = Array(HOURS_PER_DAY);

  for (let n = 0; n < HOURS_PER_DAY; n++) {
    let sumOfAverageMoods = 0;
    let i = 0;

    for (; i < NUMBER_OF_DAYS_TO_AVERAGE_OVER; i++) {
      const fromDate = subHours(startDate, n + HOURS_PER_DAY * i);
      try {
        sumOfAverageMoods += computeAverageMoodInInterval(
          moods,
          fromDate,
          addHours(fromDate, 1)
        );
      } catch {
        break;
      }
    }

    daysUsed = Math.max(daysUsed, i);

    const dateForHours = subHours(startDate, n);

    averages[getHours(dateForHours)] = [
      formatter.format(dateForHours),
      i ? sumOfAverageMoods / i : undefined,
    ];
  }

  return { averages: averages as Averages, daysUsed: daysUsed };
};

export default function AverageMoodByHour() {
  const state = React.useContext(StateContext);

  const { averages, daysUsed } = React.useMemo(
    () => computeAverages(state.moods),
    [state.moods]
  );

  return (
    <Paper>
      <h2>Average mood by hour</h2>
      <table>
        <thead>
          <tr>
            <th>Hour</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {averages.map(([day, averageMood]) => (
            <tr key={day}>
              <td>{day}</td>
              {averageMood === undefined ? (
                <td className="center">N/A</td>
              ) : (
                <MoodCell mood={averageMood} />
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="center">
        <small>
          (Calculated based on the last {daysUsed} day
          {daysUsed > 1 ? "s" : ""})
        </small>
      </p>
    </Paper>
  );
}
