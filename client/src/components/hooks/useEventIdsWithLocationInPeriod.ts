import { useSelector } from "react-redux";
import { eventsAllIdsWithLocationSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useEventIdsWithLocationInPeriod(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const ids = useSelector(eventsAllIdsWithLocationSelector);
  return getIdsInInterval(ids, dateFrom, dateTo);
}
