import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../selectors";
import { getEnvelopingIds } from "../../utils";

export default function useEnvelopingMoodIds(
  fromDate: Date,
  toDate: Date
): string[] {
  const { allIds } = useSelector(normalizedMoodsSelector);
  return getEnvelopingIds(allIds, fromDate, toDate);
}
