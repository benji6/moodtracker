import { integerFormatter } from "../../formatters/numberFormatters";
import { moodToColor } from "../../utils";
import ColumnChart from "./ColumnChart";

interface Props {
  data: number[];
}

export default function MoodFrequencyChart({ data }: Props) {
  return (
    <ColumnChart
      aria-label="Chart displaying the frequency at which different moods were recorded"
      data={data.map((count, i) => ({
        color: moodToColor(i),
        key: i,
        label: String(i),
        title: integerFormatter.format(count),
        y: count,
      }))}
      xAxisTitle="Mood"
      yAxisTitle="Count"
    />
  );
}
