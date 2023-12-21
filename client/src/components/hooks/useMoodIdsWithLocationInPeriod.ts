import { useSelector } from "react-redux";
import { getIdsInInterval } from "../../utils";
import eventsSlice from "../../store/eventsSlice";

export default function useMoodIdsWithLocationInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const ids = useSelector(eventsSlice.selectors.moodIdsWithLocation);
  return getIdsInInterval(ids, dateFrom, dateTo);
}
