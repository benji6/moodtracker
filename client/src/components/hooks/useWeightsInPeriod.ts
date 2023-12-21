import { useSelector } from "react-redux";
import { getIdsInInterval } from "../../utils";
import eventsSlice from "../../store/eventsSlice";

export default function useWeightsInPeriod(dateFrom: Date, dateTo: Date) {
  const { allIds, byId } = useSelector(eventsSlice.selectors.normalizedWeights);
  return getIdsInInterval(allIds, dateFrom, dateTo).map((id) => byId[id]);
}
