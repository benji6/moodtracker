import eventsSlice from "../../store/eventsSlice";
import { getIdsInInterval } from "../../utils";
import { useSelector } from "react-redux";

export default function useMeditationIdsInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const { allIds } = useSelector(eventsSlice.selectors.normalizedMeditations);
  return getIdsInInterval(allIds, dateFrom, dateTo);
}
