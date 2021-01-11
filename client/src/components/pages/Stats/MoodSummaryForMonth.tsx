import * as React from "react";
import { useSelector } from "react-redux";
import { normalizedAveragesByMonthSelector } from "../../../selectors";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";

interface Props {
  dates: [Date, Date, Date, Date];
  showNext: boolean;
}

export default function MoodSummaryForMonth(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByMonthSelector);

  return (
    <MoodSummaryForPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="month"
    />
  );
}
