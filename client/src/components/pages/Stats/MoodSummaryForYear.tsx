import * as React from "react";
import { useSelector } from "react-redux";
import { normalizedAveragesByYearSelector } from "../../../selectors";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";

interface Props {
  dates: [Date, Date, Date, Date];
  showNext: boolean;
}

export default function MoodSummaryForYear(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByYearSelector);

  return (
    <MoodSummaryForPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="year"
    />
  );
}
