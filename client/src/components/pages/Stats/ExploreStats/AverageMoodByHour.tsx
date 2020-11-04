import * as React from "react";
import { Paper } from "eri";
import { averageByHourSelector } from "../../../../selectors";
import { useSelector } from "react-redux";
import MoodByHourChart from "../../../shared/MoodByHourChart";

export default function AverageMoodByHour() {
  const { averages, daysUsed } = useSelector(averageByHourSelector);

  return (
    <Paper>
      <h2>Average mood by hour</h2>
      <MoodByHourChart data={averages} />
      <p className="center">
        <small>
          (Calculated based on the last {daysUsed} day
          {daysUsed > 1 ? "s" : ""})
        </small>
      </p>
    </Paper>
  );
}
