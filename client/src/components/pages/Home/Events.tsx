import { formatIsoMonthInLocalTimezone, roundDateDown } from "../../../utils";
import { Link } from "react-router";
import SummaryForMonth from "../Stats/SummaryForMonth";
import TrackedCategoriesByDay from "./TrackedCategoriesByDay";

export default function Events() {
  const dateToday = roundDateDown(new Date());

  return (
    <>
      <SummaryForMonth
        heading={
          <Link
            to={`/stats/months/${formatIsoMonthInLocalTimezone(dateToday)}`}
          >
            This month&apos;s summary
          </Link>
        }
        date={dateToday}
      />
      <TrackedCategoriesByDay />
    </>
  );
}
