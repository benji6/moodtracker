import { useSelector } from "react-redux";
import { getIdsInInterval } from "../../utils";
import eventsSlice from "../../store/eventsSlice";

export default function useMoodsInPeriod(dateFrom: Date, dateTo: Date) {
  const { allIds, byId } = useSelector(eventsSlice.selectors.normalizedMoods);
  return getIdsInInterval(allIds, dateFrom, dateTo).map((id) => byId[id]);
}
