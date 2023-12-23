import eventsSlice from "../../store/eventsSlice";
import { getIdsInInterval } from "../../utils";
import { useSelector } from "react-redux";

export default function useMoodIdsInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const { allIds } = useSelector(eventsSlice.selectors.normalizedMoods);
  return getIdsInInterval(allIds, dateFrom, dateTo);
}
