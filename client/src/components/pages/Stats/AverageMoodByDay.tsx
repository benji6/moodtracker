import * as React from "react";
import { Paper } from "eri";
import MoodCell from "./MoodCell";
import { subDays, addDays, getDay } from "date-fns";
import { roundDateDown, computeAverageMoodInInterval } from "../../../utils";
import { NormalizedMoods } from "../../../types";
import { moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";

const DAYS_PER_WEEK = 7;
const NUMBER_OF_WEEKS_TO_AVERAGE_OVER = 4;
const formatter = Intl.DateTimeFormat(undefined, { weekday: "long" });

type Averages = [
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
): { averages: Averages; weeksUsed: number } => {
  let weeksUsed = 0;
  const startDate = roundDateDown(new Date());
  const averages = Array(DAYS_PER_WEEK);

  for (let n = 0; n < DAYS_PER_WEEK; n++) {
    let sumOfAverageMoods = 0;
    let i = 0;

    for (; i < NUMBER_OF_WEEKS_TO_AVERAGE_OVER; i++) {
      const fromDate = subDays(startDate, n + DAYS_PER_WEEK * i);
      try {
        sumOfAverageMoods += computeAverageMoodInInterval(
          moods,
          fromDate,
          addDays(fromDate, 1)
        );
      } catch {
        break;
      }
    }

    weeksUsed = Math.max(weeksUsed, i);

    const dateForDayOfWeek = subDays(startDate, n);
    const dateFnsDay = getDay(dateForDayOfWeek);
    const averagesIndex = (dateFnsDay ? dateFnsDay : DAYS_PER_WEEK) - 1;

    averages[averagesIndex] = [
      formatter.format(dateForDayOfWeek),
      i ? sumOfAverageMoods / i : undefined,
    ];
  }

  return { averages: averages as Averages, weeksUsed };
};

export default function AverageMoodByDay() {
  const moods = useSelector(moodsSelector);

  const { averages, weeksUsed } = React.useMemo(() => computeAverages(moods), [
    moods,
  ]);

  return (
    <Paper>
      <h2>Average mood by day</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
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
          (Calculated based on the last {weeksUsed} week
          {weeksUsed > 1 ? "s" : ""})
        </small>
      </p>
    </Paper>
  );
}
