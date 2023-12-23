import "./style.css";
import { addDays, getDaysInMonth } from "date-fns";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  getWeekdayIndex,
  moodToColor,
  roundDateDown,
} from "../../../../utils";
import { WEEKDAY_LABELS_NARROW } from "../../../../constants";
import { dateFormatter } from "../../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../../store/eventsSlice";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  month: Date;
  small?: boolean;
}

export default function MoodCalendarForMonth({ month, small }: Props) {
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
  const normalizedAveragesByDay = useSelector(
    eventsSlice.selectors.normalizedAveragesByDay,
  );
  const navigate = useNavigate();

  const now = new Date();
  const firstMoodDate = roundDateDown(new Date(moods.allIds[0]));

  // undefined represents padding before the month
  // undefined mood represents days that have no average mood
  const data: ({ dateString: string; mood?: number } | undefined)[] = [];

  let i = getWeekdayIndex(month);
  while (i--) data.push(undefined);

  let daysInMonth = getDaysInMonth(month);
  let d = month;
  while (daysInMonth--) {
    const dateString = formatIsoDateInLocalTimezone(d);
    const mood = normalizedAveragesByDay.byId[dateString];
    data.push({ dateString, mood });
    d = addDays(d, 1);
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
        const formattedMood =
          datum?.mood === undefined
            ? undefined
            : oneDecimalPlaceFormatter.format(datum.mood);
        const date = datum
          ? createDateFromLocalDateString(datum.dateString)
          : undefined;

        return small || !datum || date! > now || date! < firstMoodDate ? (
          <div
            key={i}
            className="m-mood-calendar-for-month__day"
            style={style}
            title={formattedMood ?? "No data"}
          />
        ) : (
          <button
            aria-label={`View stats for ${dateFormatter.format(date!)}`}
            key={i}
            className="m-mood-calendar-for-month__day"
            onClick={() => navigate(`/stats/days/${datum.dateString}`)}
            style={style}
          >
            {formattedMood}
          </button>
        );
      })}
    </div>
  );
}
