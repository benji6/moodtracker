import addDays from "date-fns/addDays";
import getDaysInMonth from "date-fns/getDaysInMonth";
import * as React from "react";
import { useSelector } from "react-redux";
import { DAYS_PER_WEEK, WEEKDAY_LABELS_NARROW } from "../../../../constants";
import { normalizedAveragesByDaySelector } from "../../../../selectors";
import {
  formatIsoDateInLocalTimezone,
  getWeekdayIndex,
  moodToColor,
} from "../../../../utils";
import "./style.css";

const GRID_GAP = "var(--e-space-0)";

interface Props {
  blockSize?: string;
  month: Date;
}

export default function MoodCalendarForMonth({
  blockSize = "var(--e-space-4)",
  month,
}: Props) {
  const normalizedAveragesByDay = useSelector(normalizedAveragesByDaySelector);

  // undefined represents padding before the month
  // null represents days that have no average mood
  const data: (number | null | undefined)[] = [];

  let i = getWeekdayIndex(month);
  while (i--) data.push(undefined);

  let daysInMonth = getDaysInMonth(month);
  let d0 = month;
  while (true) {
    const dateString = formatIsoDateInLocalTimezone(d0);
    const mood = normalizedAveragesByDay.byId[dateString];
    data.push(mood ?? null);
    if (!daysInMonth--) break;
    d0 = addDays(d0, 1);
  }

  return (
    <div
      aria-label="A calendar visualization of mood for each day of the month"
      style={{
        display: "grid",
        gridGap: GRID_GAP,
        gridTemplateColumns: "repeat(7, 1fr)",
        margin: "auto",
        maxWidth: `calc(${DAYS_PER_WEEK} * ${blockSize} + ${
          DAYS_PER_WEEK - 1
        } * ${GRID_GAP})`,
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
          className="m-calendar-day"
          style={{
            animationDelay: `calc(var(--e-time-2) / ${data.length} * ${i}`,
            background:
              mood === null
                ? "var(--e-color-balance-less)"
                : mood === undefined
                ? "none"
                : moodToColor(mood),
            height: blockSize,
          }}
          title={mood === null ? "No data" : mood?.toFixed(1)}
        />
      ))}
    </div>
  );
}
