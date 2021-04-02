import addDays from "date-fns/addDays";
import getDaysInMonth from "date-fns/getDaysInMonth";
import * as React from "react";
import { useSelector } from "react-redux";
import { WEEKDAY_LABELS_NARROW } from "../../../../constants";
import { normalizedAveragesByDaySelector } from "../../../../selectors";
import {
  formatIsoDateInLocalTimezone,
  getWeekdayIndex,
  moodToColor,
} from "../../../../utils";
import "./style.css";

interface Props {
  month: Date;
  small?: boolean;
}

export default function MoodCalendarForMonth({ month, small }: Props) {
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
      className={`m-mood-calendar-for-month${
        small ? " m-mood-calendar-for-month--small" : ""
      }`}
    >
      {WEEKDAY_LABELS_NARROW.map((label, i) => (
        <div key={i} className="center">
          <small>{label}</small>
        </div>
      ))}
      {data.map((mood, i) => (
        <div
          key={i}
          className="m-mood-calendar-for-month__day "
          style={{
            animationDelay: `calc(var(--time-2) / ${data.length} * ${i}`,
            background:
              mood === null
                ? "var(--color-balance-less)"
                : mood === undefined
                ? "none"
                : moodToColor(mood),
          }}
          title={mood === null ? "No data" : mood?.toFixed(1)}
        />
      ))}
    </div>
  );
}
