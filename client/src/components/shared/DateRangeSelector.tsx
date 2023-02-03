import addMinutes from "date-fns/addMinutes";
import subDays from "date-fns/subDays";
import { DateField } from "eri";
import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../selectors";
import {
  formatIsoDateInLocalTimezone,
  roundDateDown,
  roundDateUp,
} from "../../utils";

interface Props {
  dateFrom: Date;
  dateTo: Date;
  setDateFrom(date: Date): void;
  setDateTo(date: Date): void;
}

export default function DateRangeSelector({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
}: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const maxDate = roundDateUp(new Date());

  return (
    <>
      <DateField
        label="From"
        max={formatIsoDateInLocalTimezone(subDays(dateTo, 1))}
        min={formatIsoDateInLocalTimezone(new Date(moods.allIds[0]))}
        onChange={(e) => {
          let { valueAsDate: date } = e.target;
          if (!date) return;
          const timezoneOffset = date.getTimezoneOffset();
          if (timezoneOffset) date = addMinutes(date, date.getTimezoneOffset());
          if (
            date < roundDateDown(dateTo) &&
            date >= roundDateDown(new Date(moods.allIds[0]))
          )
            setDateFrom(date);
        }}
        value={formatIsoDateInLocalTimezone(dateFrom)}
      />
      <DateField
        label="To"
        max={formatIsoDateInLocalTimezone(maxDate)}
        min={formatIsoDateInLocalTimezone(dateFrom)}
        onChange={(e) => {
          let { valueAsDate: date } = e.target;
          if (!date) return;
          const timezoneOffset = date.getTimezoneOffset();
          if (timezoneOffset) date = addMinutes(date, date.getTimezoneOffset());
          if (date >= dateFrom && date <= maxDate) setDateTo(date);
        }}
        value={formatIsoDateInLocalTimezone(dateTo)}
      />
    </>
  );
}
