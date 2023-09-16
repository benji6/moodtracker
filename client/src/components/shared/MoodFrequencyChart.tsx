import { Chart } from "eri";
import { integerFormatter } from "../../formatters/numberFormatters";
import { moodToColor } from "../../utils";

interface Props {
  data: number[];
}

export default function MoodFrequencyChart({ data }: Props) {
  return (
    <Chart.ColumnChart
      aria-label="Chart displaying the frequency at which different moods were recorded"
      data={data.map((count, i) => ({
        color: moodToColor(i),
        key: i,
        label: String(i),
        title: `Count: ${integerFormatter.format(count)}`,
        y: count,
      }))}
      xAxisTitle="Mood"
      yAxisTitle="Count"
    />
  );
}
