import { useSelector } from "react-redux";
import { moodIdsWithLocationSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useMoodIdsWithLocationInPeriod(
  dateFrom: Date,
  dateTo: Date
): string[] {
  const ids = useSelector(moodIdsWithLocationSelector);
  return getIdsInInterval(ids, dateFrom, dateTo);
}
