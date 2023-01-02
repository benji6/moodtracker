import { useSelector } from "react-redux";
import { normalizedWeightsSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useWeightsInPeriod(dateFrom: Date, dateTo: Date) {
  const { allIds, byId } = useSelector(normalizedWeightsSelector);
  return getIdsInInterval(allIds, dateFrom, dateTo).map((id) => byId[id]);
}
