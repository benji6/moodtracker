import addDays from "date-fns/addDays";
import getDaysInMonth from "date-fns/getDaysInMonth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { WEEKDAY_LABELS_NARROW } from "../../../../constants";
import { dateFormatter } from "../../../../dateTimeFormatters";
import { oneDecimalPlaceFormatter } from "../../../../numberFormatters";
import {
  normalizedAveragesByDaySelector,
  normalizedMoodsSelector,
} from "../../../../selectors";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  getWeekdayIndex,
  moodToColor,
  roundDateDown,
} from "../../../../utils";
import "./style.css";

interface Props {
  month: Date;
  small?: boolean;
}

export default function MoodCalendarForMonth({ month, small }: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const normalizedAveragesByDay = useSelector(normalizedAveragesByDaySelector);
  const navigate = useNavigate();

  const now = new Date();
  const firstMoodDate = roundDateDown(new Date(moods.allIds[0]));

  // undefined represents padding before the month
  // undefined mood represents days that have no average mood
  const data: ({ dateString: string; mood?: number } | undefined)[] = [];

  let i = getWeekdayIndex(month);
  while (i--) data.push(undefined);

  let daysInMonth = getDaysInMonth(month);
  let d0 = month;
  while (true) {
    const dateString = formatIsoDateInLocalTimezone(d0);
    const mood = normalizedAveragesByDay.byId[dateString];
    data.push({ dateString, mood });
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
      {data.map((datum, i) => {
        const style = {
          animationDelay: `calc(var(--time-2) / ${data.length} * ${i}`,
          background:
            datum === undefined
              ? "none"
              : datum.mood === undefined
              ? "var(--color-balance-less)"
              : moodToColor(datum.mood),
        };
        const title =
          datum?.mood === undefined
            ? "No data"
            : oneDecimalPlaceFormatter.format(datum.mood);
        const date = datum
          ? createDateFromLocalDateString(datum.dateString)
          : undefined;

        return small || !datum || date! > now || date! < firstMoodDate ? (
          <div
            key={i}
            className="m-mood-calendar-for-month__day"
            style={style}
            title={title}
          />
        ) : (
          <button
            aria-label={`View stats for ${dateFormatter.format(date!)}`}
            key={i}
            className="m-mood-calendar-for-month__day"
            onClick={() => navigate(`/stats/days/${datum.dateString}`)}
            style={style}
            title={title}
          />
        );
      })}
    </div>
  );
}
