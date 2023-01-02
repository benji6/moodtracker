import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useMoodsInPeriod(dateFrom: Date, dateTo: Date) {
  const { allIds, byId } = useSelector(normalizedMoodsSelector);
  return getIdsInInterval(allIds, dateFrom, dateTo).map((id) => byId[id]);
}
