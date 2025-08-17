import MoodChart from "../../../shared/MoodChart";
import { Paper } from "eri";
import { RootState } from "../../../../store";
import computeTrendlinePoints from "./computeTrendlinePoints";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  centerXAxisLabels?: boolean;
  dateFrom: Date;
  dateTo: Date;
  hidePoints?: boolean;
  xAxisTitle?: string;
  xLabels: string[];
}

export default function MoodChartForPeriod({
  centerXAxisLabels = false,
  dateFrom,
  dateTo,
  hidePoints = false,
  xAxisTitle,
  xLabels,
}: Props) {
  const domain: [number, number] = [dateFrom.getTime(), dateTo.getTime()];
  const envelopingMoods = useSelector((state: RootState) =>
    eventsSlice.selectors.envelopingDenormalizedMoodsOrderedByExperiencedAt(
      state,
      dateFrom,
      dateTo,
    ),
  );

  if (envelopingMoods.length < 2) return;

  const data: [number, number][] = envelopingMoods.map(
    ({ experiencedAt, mood }) => {
      return [new Date(experiencedAt).getTime(), mood];
    },
  );

  return (
    <Paper>
      <h3>Mood chart</h3>
      <MoodChart
        centerXAxisLabels={centerXAxisLabels}
        data={data}
        domain={domain}
        hidePoints={hidePoints}
        trendlinePoints={computeTrendlinePoints(envelopingMoods, domain)}
        xAxisTitle={xAxisTitle}
        xLabels={xLabels}
      />
    </Paper>
  );
}
