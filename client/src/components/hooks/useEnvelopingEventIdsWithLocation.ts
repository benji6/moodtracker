import { useSelector } from "react-redux";
import { getEnvelopingIds } from "../../utils";
import eventsSlice from "../../store/eventsSlice";

export default function useEnvelopingEventIdsWithLocation(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const ids = useSelector(eventsSlice.selectors.allIdsWithLocation);
  return getEnvelopingIds(ids, dateFrom, dateTo);
}
