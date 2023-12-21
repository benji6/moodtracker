import { useSelector } from "react-redux";
import { getIdsInInterval } from "../../utils";
import eventsSlice from "../../store/eventsSlice";

export default function useEventIdsWithLocationInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const ids = useSelector(eventsSlice.selectors.allIdsWithLocation);
  return getIdsInInterval(ids, dateFrom, dateTo);
}
