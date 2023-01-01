import { useSelector } from "react-redux";
import { normalizedWeightsSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useWeightsInPeriod(fromDate: Date, toDate: Date) {
  const { allIds, byId } = useSelector(normalizedWeightsSelector);
  return getIdsInInterval(allIds, fromDate, toDate).map((id) => byId[id]);
}
