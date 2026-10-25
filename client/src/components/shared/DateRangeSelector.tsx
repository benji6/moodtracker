import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  roundDateDown,
} from "../../utils";
import { DateField } from "eri";
import eventsSlice from "../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
  setDateFrom(date: Date): void;
  setDateTo(date: Date): void;
  minDate?: Date | null;
  maxDate?: Date | null;
}

export default function DateRangeSelector({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  minDate,
  maxDate = new Date(),
}: Props) {
  const denormalizedMoodsOrderedByExperiencedAt = useSelector(
    eventsSlice.selectors.denormalizedMoodsOrderedByExperiencedAt,
  );
  const firstMood = denormalizedMoodsOrderedByExperiencedAt[0];
  const minimum =
    minDate === undefined
      ? firstMood && roundDateDown(new Date(firstMood.experiencedAt))
      : minDate;

  const readDate = (value: string) =>
    value ? createDateFromLocalDateString(value) : undefined;

  return (
    <>
      <DateField
        label="From"
        max={formatIsoDateInLocalTimezone(
          maxDate && maxDate < dateTo ? maxDate : dateTo,
        )}
        min={minimum ? formatIsoDateInLocalTimezone(minimum) : undefined}
        onChange={(e) => {
          const date = readDate(e.target.value);
          if (!date) return;
          if (
            date <= roundDateDown(dateTo) &&
            (!minimum || date >= minimum) &&
            (!maxDate || date <= maxDate)
          )
            setDateFrom(date);
        }}
        value={formatIsoDateInLocalTimezone(dateFrom)}
      />
      <DateField
        label="To"
        max={maxDate ? formatIsoDateInLocalTimezone(maxDate) : undefined}
        min={formatIsoDateInLocalTimezone(dateFrom)}
        onChange={(e) => {
          const date = readDate(e.target.value);
          if (!date) return;
          if (
            date >= roundDateDown(dateFrom) &&
            (!maxDate || date <= maxDate) &&
            (!minimum || date >= minimum)
          )
            setDateTo(date);
        }}
        value={formatIsoDateInLocalTimezone(dateTo)}
      />
    </>
  );
}
