import * as React from "react";
import { Chart, Paper } from "eri";
import { setHours } from "date-fns";
import { moodToColor } from "../../../../utils";
import { HOURS_PER_DAY, MOOD_RANGE } from "../../../../constants";
import { averageByHourSelector } from "../../../../selectors";
import { useSelector } from "react-redux";

const arbitraryDate = new Date();
const formatter = Intl.DateTimeFormat(undefined, { hour: "numeric" });

export default function AverageMoodByHour() {
  const { averages, daysUsed } = useSelector(averageByHourSelector);

  const xLabels: [number, string][] = [];
  for (let i = 0; i < HOURS_PER_DAY; i += 4)
    xLabels.push([i, formatter.format(setHours(arbitraryDate, i))]);

  const yLabels: [number, string][] = [
    ...Array(MOOD_RANGE[1] + 1).keys(),
  ].map((y) => [y, String(y)]);

  const xLines = xLabels.map(([x]) => x);
  const yLines = yLabels.map(([y]) => y);

  return (
    <Paper>
      <h2>Average mood by hour</h2>
      <Chart.LineChart
        aria-label="Chart displaying average mood against hour of the day"
        colorFromY={moodToColor}
        data={averages}
        domain={[0, HOURS_PER_DAY - 1]}
        range={MOOD_RANGE}
        xAxisTitle="Hour of day"
        yAxisTitle="Mood"
      >
        <Chart.XGridLines lines={xLines} />
        <Chart.YGridLines lines={yLines} />
        <Chart.XAxis labels={xLabels} markers={xLines} />
        <Chart.YAxis labels={yLabels} markers={yLines} />
      </Chart.LineChart>
      <p className="center">
        <small>
          (Calculated based on the last {daysUsed} day
          {daysUsed > 1 ? "s" : ""})
        </small>
      </p>
    </Paper>
  );
}
