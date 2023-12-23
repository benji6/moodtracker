import eventsSlice from "../../store/eventsSlice";
import { getEnvelopingIds } from "../../utils";
import { useSelector } from "react-redux";

export default function useEnvelopingMoodIds(
  dateFrom: Date,
  dateTo: Date,
): string[] {
  const { allIds } = useSelector(eventsSlice.selectors.normalizedMoods);
  return getEnvelopingIds(allIds, dateFrom, dateTo);
}
