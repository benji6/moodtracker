import { Chart } from "eri";
import { MOOD_EXTENT } from "../../constants";
import { oneDecimalPlaceFormatter } from "../../formatters/numberFormatters";
import { moodToColor } from "../../utils";

interface Props {
  averages: [
    [string, number | undefined],
    [string, number | undefined],
    [string, number | undefined],
    [string, number | undefined],
    [string, number | undefined],
    [string, number | undefined],
    [string, number | undefined],
  ];
  onClick?(i: number): void;
}

export default function MoodByWeekdayChart({ averages, onClick }: Props) {
  return (
    <Chart.ColumnChart
      aria-label="Chart displaying average mood by weekday"
      data={averages.map(([day, averageMood], i) => ({
        color: averageMood === undefined ? undefined : moodToColor(averageMood),
        key: day,
        label: day,
        onClick: onClick && (() => onClick(i)),
        title:
          averageMood === undefined
            ? undefined
            : `Average mood: ${oneDecimalPlaceFormatter.format(averageMood)}`,
        y: averageMood,
      }))}
      maxRange={MOOD_EXTENT}
      rotateXLabels
      xAxisTitle="Weekday"
      yAxisTitle="Average mood"
    />
  );
}
