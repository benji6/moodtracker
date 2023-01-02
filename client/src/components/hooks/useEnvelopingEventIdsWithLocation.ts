import { useSelector } from "react-redux";
import { eventsAllIdsWithLocationSelector } from "../../selectors";
import { getEnvelopingIds } from "../../utils";

export default function useEnvelopingEventIdsWithLocation(
  dateFrom: Date,
  dateTo: Date
): string[] {
  const ids = useSelector(eventsAllIdsWithLocationSelector);
  return getEnvelopingIds(ids, dateFrom, dateTo);
}
