import { formatIsoDateInLocalTimezone, roundDateDown } from "../../../utils";
import { Link } from "react-router-dom";
import SummaryForWeek from "../Stats/SummaryForWeek";
import TrackedCategoriesByDay from "./TrackedCategoriesByDay";
import { WEEK_OPTIONS } from "../../../formatters/dateTimeFormatters";
import { startOfWeek } from "date-fns";

export default function Events() {
  const dateToday = roundDateDown(new Date());

  return (
    <>
      <SummaryForWeek
        heading={
          <Link
            to={`/stats/weeks/${formatIsoDateInLocalTimezone(
              startOfWeek(dateToday, WEEK_OPTIONS),
            )}`}
          >
            This week&apos;s summary
          </Link>
        }
        date={dateToday}
      />
      <TrackedCategoriesByDay />
    </>
  );
}
