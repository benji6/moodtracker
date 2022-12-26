import { oneDecimalPlaceFormatter } from "../../formatters/numberFormatters";
import { moodToColor } from "../../utils";
import ColumnChart from "./ColumnChart";

export type DayAverages = [
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined],
  [string, number | undefined]
];

interface Props {
  averages: DayAverages;
  onClick?(i: number): void;
}

export default function MoodByWeekdayChart({ averages, onClick }: Props) {
  return (
    <ColumnChart
      aria-label="Chart displaying average mood by weekday"
      data={averages.map(([day, averageMood]) => ({
        color: averageMood === undefined ? undefined : moodToColor(averageMood),
        key: day,
        label: day,
        title:
          averageMood === undefined
            ? undefined
            : `Average mood: ${oneDecimalPlaceFormatter.format(averageMood)}`,
        y: averageMood,
      }))}
      maxRange={10}
      onBarClick={onClick}
      rotateXLabels
      xAxisTitle="Weekday"
      yAxisTitle="Average mood"
    />
  );
}
