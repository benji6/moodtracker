import { useSelector } from "react-redux";
import { normalizedMeditationsSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useMeditationIdsInPeriod(
  dateFrom: Date,
  dateTo: Date
): string[] {
  const { allIds } = useSelector(normalizedMeditationsSelector);
  return getIdsInInterval(allIds, dateFrom, dateTo);
}
