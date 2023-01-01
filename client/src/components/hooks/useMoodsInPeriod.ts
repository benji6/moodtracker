import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../selectors";
import { getIdsInInterval } from "../../utils";

export default function useMoodsInPeriod(fromDate: Date, toDate: Date) {
  const { allIds, byId } = useSelector(normalizedMoodsSelector);
  return getIdsInInterval(allIds, fromDate, toDate).map((id) => byId[id]);
}
