import { useSelector } from "react-redux";
import { getIdsInInterval } from "../../utils";
import eventsSlice from "../../store/eventsSlice";

export default function useMoodIdsInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const { allIds } = useSelector(eventsSlice.selectors.normalizedMoods);
  return getIdsInInterval(allIds, dateFrom, dateTo);
}
