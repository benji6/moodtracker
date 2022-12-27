import { useSelector } from "react-redux";
import { moodIdsWithLocationSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useMoodIdsWithLocationInPeriod(
  fromDate: Date,
  toDate: Date
): string[] {
  const ids = useSelector(moodIdsWithLocationSelector);
  return getIdsInInterval(ids, fromDate, toDate);
}
