import addDays from "date-fns/addDays";
import addWeeks from "date-fns/addWeeks";
import { TIME } from "../../../constants";
import { weekdayShortFormatter } from "../../../formatters/dateTimeFormatters";
import MoodChartForPeriod from "./MoodChartForPeriod";

interface Props {
  week: Date;
}

export default function MoodChartForWeek({ week }: Props) {
  const nextWeek = addWeeks(week, 1);

  const xLabels: [number, string][] = [];
  for (let i = 0; i < TIME.daysPerWeek; i++) {
    const date = addDays(week, i);
    xLabels.push([
      (date.getTime() + addDays(date, 1).getTime()) / 2,
      weekdayShortFormatter.format(date),
    ]);
  }

  const xLines: number[] = [];
  for (let i = 0; i <= TIME.daysPerWeek; i++) {
    const date = addDays(week, i);
    xLines.push(date.getTime());
  }

  return (
    <MoodChartForPeriod
      fromDate={week}
      toDate={nextWeek}
      xLabels={xLabels}
      xLines={xLines}
    />
  );
}
