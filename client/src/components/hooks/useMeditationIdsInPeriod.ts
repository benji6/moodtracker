import { useSelector } from "react-redux";
import { getIdsInInterval } from "../../utils";
import eventsSlice from "../../store/eventsSlice";

export default function useMeditationIdsInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const { allIds } = useSelector(eventsSlice.selectors.normalizedMeditations);
  return getIdsInInterval(allIds, dateFrom, dateTo);
}
