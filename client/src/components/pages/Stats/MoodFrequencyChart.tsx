import { Chart, Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { MOOD_RANGE } from "../../../constants";
import { moodsSelector } from "../../../selectors";
import { getMoodIdsInInterval, moodToColor } from "../../../utils";

const MOOD_FREQUENCY_CHART_MAX_Y_LABELS = 10;

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodFrequencyChart({ fromDate, toDate }: Props) {
  const moods = useSelector(moodsSelector);

  const moodIdsInMonth = getMoodIdsInInterval(moods.allIds, fromDate, toDate);

  const moodValues = moodIdsInMonth.map((id) => moods.byId[id].mood);
  const moodCounter = new Map(
    [...Array(MOOD_RANGE[1] - MOOD_RANGE[0] + 1).keys()].map((n) => [
      MOOD_RANGE[0] + n,
      0,
    ])
  );

  for (const moodValue of moodValues) {
    // handle old data stored in decimal format
    const rounded = Math.round(moodValue);
    moodCounter.set(rounded, moodCounter.get(rounded)! + 1);
  }
  const moodFrequencyData: [number, number][] = [];
  let maxFrequency = 0;

  for (const [mood, frequency] of moodCounter.entries()) {
    if (frequency > maxFrequency) maxFrequency = frequency;
    moodFrequencyData.push([mood, frequency]);
  }

  const moodFrequencyYLabels: [number, string][] =
    maxFrequency < MOOD_FREQUENCY_CHART_MAX_Y_LABELS
      ? [...Array(maxFrequency + 1).keys()].map((y) => [y, String(y)])
      : [...Array(MOOD_FREQUENCY_CHART_MAX_Y_LABELS).keys()].map((n) => {
          const y = Math.round(
            (n / (MOOD_FREQUENCY_CHART_MAX_Y_LABELS - 1)) * maxFrequency
          );
          return [y, String(y)];
        });

  return (
    <Paper>
      <h3>Mood frequency</h3>
      <Chart.BarChart
        aria-label="Chart displaying the frequency at which different moods were recorded"
        domain={MOOD_RANGE}
        range={[0, maxFrequency]}
        xAxisTitle="Mood"
        xLabels={moodFrequencyData.map(([mood]) => mood).map(String)}
        yAxisTitle="Count"
      >
        <Chart.PlotArea>
          <Chart.Bars
            colorFromX={(x) => moodToColor(x * 10)}
            data={moodFrequencyData.map(([_, frequency]) => frequency)}
          />
        </Chart.PlotArea>
        <Chart.YGridLines lines={moodFrequencyYLabels.map(([y]) => y)} />
        <Chart.YAxis
          labels={moodFrequencyYLabels}
          markers={moodFrequencyYLabels.map(([x]) => x)}
        />
      </Chart.BarChart>
    </Paper>
  );
}
