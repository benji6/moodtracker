import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useMoodIdsInPeriod(
  fromDate: Date,
  toDate: Date
): string[] {
  const { allIds } = useSelector(normalizedMoodsSelector);
  return getIdsInInterval(allIds, fromDate, toDate);
}
