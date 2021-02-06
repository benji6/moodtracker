import * as React from "react";
import { Chart } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../constants";
import { moodToColor } from "../../utils";

export type DayAverages = [
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined]
];

interface IProps {
  averages: DayAverages;
}

export default function MoodByWeekdayChart({ averages }: IProps) {
  return (
    <Chart.BarChart
      aria-label="Chart displaying average mood by weekday"
      range={MOOD_RANGE}
      xAxisTitle="Weekday"
      xLabels={averages.map(([day]) => day)}
      yAxisTitle="Average mood"
    >
      <Chart.YGridLines lines={MOOD_INTEGERS as number[]} />
      <Chart.PlotArea>
        <Chart.Bars
          colorFromY={moodToColor}
          data={averages.map(([, averageMood]) => averageMood)}
        />
      </Chart.PlotArea>
      <Chart.YAxis
        labels={MOOD_INTEGERS.map((mood) => [mood, String(mood)])}
        markers={MOOD_INTEGERS as number[]}
      />
    </Chart.BarChart>
  );
}
