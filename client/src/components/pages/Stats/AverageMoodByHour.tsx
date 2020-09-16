import * as React from "react";
import { Paper, Chart } from "eri";
import { subHours, addHours, getHours, set, setHours } from "date-fns";
import { computeAverageMoodInInterval, moodToColor } from "../../../utils";
import { StateContext } from "../../AppState";
import { NormalizedMoods } from "../../../types";
import { MOOD_RANGE } from "../../../constants";

const HOURS_PER_DAY = 24;
const NUMBER_OF_DAYS_TO_AVERAGE_OVER = 7;

const arbitraryDate = new Date();
const formatter = Intl.DateTimeFormat(undefined, { hour: "numeric" });

type Averages = [number, number][];

const computeAverages = (
  moods: NormalizedMoods
): { averages: Averages; daysUsed: number } => {
  let daysUsed = 0;
  const startDate = subHours(
    set(new Date(), {
      milliseconds: 0,
      minutes: 30,
      seconds: 0,
    }),
    1
  );
  const averages: Averages = Array(HOURS_PER_DAY);

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

    if (i) {
      const hours = getHours(subHours(startDate, n));
      averages[hours] = [hours, sumOfAverageMoods / i];
    }
  }

  return { averages: averages.filter((x) => x !== undefined), daysUsed };
};

export default function AverageMoodByHour() {
  const state = React.useContext(StateContext);

  const { averages, daysUsed } = React.useMemo(
    () => computeAverages(state.moods),
    [state.moods]
  );

  const xLabels: [number, string][] = [];
  for (let i = 0; i < HOURS_PER_DAY; i += 4)
    xLabels.push([i, formatter.format(setHours(arbitraryDate, i))]);

  return (
    <Paper>
      <h2>Average mood by hour</h2>
      <Chart
        aria-label="Chart displaying average mood against hour of the day"
        colorFromY={moodToColor}
        data={averages}
        domain={[0, HOURS_PER_DAY - 1]}
        range={MOOD_RANGE}
        xAxisLabel="Hour of day"
        xLabels={xLabels}
        yLabels={[...Array(MOOD_RANGE[1] + 1).keys()].map((y) => [
          y,
          String(y),
        ])}
      />
      <p className="center">
        <small>
          (Calculated based on the last {daysUsed} day
          {daysUsed > 1 ? "s" : ""})
        </small>
      </p>
    </Paper>
  );
}
