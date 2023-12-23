import eventsSlice from "../../store/eventsSlice";
import { getEnvelopingIds } from "../../utils";
import { useSelector } from "react-redux";

export default function useEnvelopingEventIdsWithLocation(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const ids = useSelector(eventsSlice.selectors.allIdsWithLocation);
  return getEnvelopingIds(ids, dateFrom, dateTo);
}
