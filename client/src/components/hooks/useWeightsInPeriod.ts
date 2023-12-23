import eventsSlice from "../../store/eventsSlice";
import { getIdsInInterval } from "../../utils";
import { useSelector } from "react-redux";

export default function useWeightsInPeriod(dateFrom: Date, dateTo: Date) {
  const { allIds, byId } = useSelector(eventsSlice.selectors.normalizedWeights);
  return getIdsInInterval(allIds, dateFrom, dateTo).map((id) => byId[id]);
}
