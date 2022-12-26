import { useSelector } from "react-redux";
import { eventsAllIdsWithLocationSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useEventIdsWithLocationInPeriod(
  fromDate: Date,
  toDate: Date
): string[] {
  const ids = useSelector(eventsAllIdsWithLocationSelector);
  return getIdsInInterval(ids, fromDate, toDate);
}
