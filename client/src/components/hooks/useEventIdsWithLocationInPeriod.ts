import eventsSlice from "../../store/eventsSlice";
import { getIdsInInterval } from "../../utils";
import { useSelector } from "react-redux";

export default function useEventIdsWithLocationInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const ids = useSelector(eventsSlice.selectors.allIdsWithLocation);
  return getIdsInInterval(ids, dateFrom, dateTo);
}
