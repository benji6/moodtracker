import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useMoodIdsInPeriod(
  dateFrom: Date,
  dateTo: Date
): string[] {
  const { allIds } = useSelector(normalizedMoodsSelector);
  return getIdsInInterval(allIds, dateFrom, dateTo);
}
