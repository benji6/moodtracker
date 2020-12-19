import * as React from "react";
import { Paper } from "eri";
import { averageByDaySelector } from "../../../../selectors";
import { useSelector } from "react-redux";
import MoodByWeekdayChart from "../../../shared/MoodByWeekdayChart";

export default function AverageMoodByWeekday() {
  const { averages, weeksUsed } = useSelector(averageByDaySelector);

  return (
    <Paper>
      <h2>Average mood by weekday</h2>
      <MoodByWeekdayChart averages={averages} />
      <p className="center">
        <small>
          (Calculated based on the last {weeksUsed} week
          {weeksUsed > 1 ? "s" : ""})
        </small>
      </p>
    </Paper>
  );
}
