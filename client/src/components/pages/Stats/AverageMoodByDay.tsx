import * as React from "react";
import { Paper } from "eri";
import MoodCell from "./MoodCell";
import { averageByDaySelector } from "../../../selectors";
import { useSelector } from "react-redux";

export default function AverageMoodByDay() {
  const { averages, weeksUsed } = useSelector(averageByDaySelector);

  return (
    <Paper>
      <h2>Average mood by day</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {averages.map(([day, averageMood]) => (
            <tr key={day}>
              <td>{day}</td>
              {averageMood === undefined ? (
                <td className="center">N/A</td>
              ) : (
                <MoodCell mood={averageMood} />
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="center">
        <small>
          (Calculated based on the last {weeksUsed} week
          {weeksUsed > 1 ? "s" : ""})
        </small>
      </p>
    </Paper>
  );
}
