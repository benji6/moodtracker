import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../selectors";
import { getEnvelopingIds } from "../../utils";

export default function useEnvelopingMoodIds(
  dateFrom: Date,
  dateTo: Date
): string[] {
  const { allIds } = useSelector(normalizedMoodsSelector);
  return getEnvelopingIds(allIds, dateFrom, dateTo);
}
