import * as React from "react";
import { useSelector } from "react-redux";
import { normalizedAveragesByDaySelector } from "../../../selectors";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";

interface Props {
  dates: [Date, Date, Date, Date];
  showNext: boolean;
}

export default function MoodSummaryForDay(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByDaySelector);

  return (
    <MoodSummaryForPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="day"
    />
  );
}
