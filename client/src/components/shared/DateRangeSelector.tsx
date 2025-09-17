import { addMinutes, subDays } from "date-fns";
import { formatIsoDateInLocalTimezone, roundDateDown } from "../../utils";
import { DateField } from "eri";
import eventsSlice from "../../store/eventsSlice";
import { useSelector } from "react-redux";

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
  const denormalizedMoodsOrderedByExperiencedAt = useSelector(
    eventsSlice.selectors.denormalizedMoodsOrderedByExperiencedAt,
  );
  const maxDate = new Date();

  return (
    <>
      <DateField
        label="From"
        max={formatIsoDateInLocalTimezone(subDays(dateTo, 1))}
        min={formatIsoDateInLocalTimezone(
          new Date(denormalizedMoodsOrderedByExperiencedAt[0].experiencedAt),
        )}
        onChange={(e) => {
          let { valueAsDate: date } = e.target;
          if (!date) return;
          const timezoneOffset = date.getTimezoneOffset();
          if (timezoneOffset) date = addMinutes(date, date.getTimezoneOffset());
          if (
            date < roundDateDown(dateTo) &&
            date >=
              roundDateDown(
                new Date(
                  denormalizedMoodsOrderedByExperiencedAt[0].experiencedAt,
                ),
              )
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
