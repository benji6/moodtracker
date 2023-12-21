import { useSelector } from "react-redux";
import { getEnvelopingIds } from "../../utils";
import eventsSlice from "../../store/eventsSlice";

export default function useEnvelopingMoodIds(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const { allIds } = useSelector(eventsSlice.selectors.normalizedMoods);
  return getEnvelopingIds(allIds, dateFrom, dateTo);
}
