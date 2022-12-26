import { useSelector } from "react-redux";
import { eventsAllIdsWithLocationSelector } from "../../selectors";
import { getEnvelopingIds } from "../../utils";

export default function useEnvelopingEventIdsWithLocation(
  fromDate: Date,
  toDate: Date
): string[] {
  const ids = useSelector(eventsAllIdsWithLocationSelector);
  return getEnvelopingIds(ids, fromDate, toDate);
}
