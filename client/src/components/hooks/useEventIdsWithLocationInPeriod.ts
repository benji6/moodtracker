import { useSelector } from "react-redux";
import { eventsAllIdsWithLocationSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useEventIdsWithLocationInPeriod(
  fromDate: Date,
  toDate: Date
): string[] {
  const eventsAllIdsWithLocation = useSelector(
    eventsAllIdsWithLocationSelector
  );
  return getIdsInInterval(eventsAllIdsWithLocation, fromDate, toDate);
}
