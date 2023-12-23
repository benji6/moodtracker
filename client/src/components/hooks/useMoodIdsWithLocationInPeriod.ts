import eventsSlice from "../../store/eventsSlice";
import { getIdsInInterval } from "../../utils";
import { useSelector } from "react-redux";

export default function useMoodIdsWithLocationInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const ids = useSelector(eventsSlice.selectors.moodIdsWithLocation);
  return getIdsInInterval(ids, dateFrom, dateTo);
}
