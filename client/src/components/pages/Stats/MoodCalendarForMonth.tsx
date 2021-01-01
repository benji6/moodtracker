import { addDays, getDaysInMonth } from "date-fns";
import { Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { DAYS_PER_WEEK, WEEKDAY_LABELS_NARROW } from "../../../constants";
import { moodsSelector } from "../../../selectors";
import {
  computeAverageMoodInInterval,
  getWeekdayIndex,
  moodToColor,
} from "../../../utils";

const BLOCK_SIZE = "var(--e-space-4)";

interface Props {
  month: Date;
}

export default function MoodCalendarForMonth({ month }: Props) {
  const moods = useSelector(moodsSelector);

  // undefined represents padding before the month
  // null represents days that have no average mood
  const data: (number | null | undefined)[] = [];

  let i = getWeekdayIndex(month);
  while (i--) data.push(undefined);

  let daysInMonth = getDaysInMonth(month);
  let d0 = month;
  while (daysInMonth--) {
    const d1 = addDays(d0, 1);
    const averageMood = computeAverageMoodInInterval(moods, d0, d1);
    data.push(averageMood ?? null);
    d0 = d1;
  }

  return (
    <Paper>
      <h3>Calendar view</h3>
      <div
        aria-label="A calendar visualization of mood for each day of the month"
        style={{
          display: "grid",
          gridGap: "var(--e-space-0)",
          gridTemplateColumns: "repeat(7, 1fr)",
          margin: "auto",
          maxWidth: `calc(${DAYS_PER_WEEK} * ${BLOCK_SIZE})`,
        }}
      >
        {WEEKDAY_LABELS_NARROW.map((label, i) => (
          <div key={i} className="center">
            <small>{label}</small>
          </div>
        ))}
        {data.map((mood, i) => (
          <div
            key={i}
            style={{
              background:
                mood === null
                  ? "var(--e-color-balance-less)"
                  : mood === undefined
                  ? "none"
                  : moodToColor(mood),
              height: BLOCK_SIZE,
            }}
            title={mood === null ? "No data" : mood?.toFixed(1)}
          />
        ))}
      </div>
    </Paper>
  );
}
