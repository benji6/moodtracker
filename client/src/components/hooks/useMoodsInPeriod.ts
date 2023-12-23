import eventsSlice from "../../store/eventsSlice";
import { getIdsInInterval } from "../../utils";
import { useSelector } from "react-redux";

export default function useMoodsInPeriod(dateFrom: Date, dateTo: Date) {
  const { allIds, byId } = useSelector(eventsSlice.selectors.normalizedMoods);
  return getIdsInInterval(allIds, dateFrom, dateTo).map((id) => byId[id]);
}
