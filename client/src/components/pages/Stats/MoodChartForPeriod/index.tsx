import { Paper } from "eri";
import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../../../selectors";
import useEnvelopingMoodIds from "../../../hooks/useEnvelopingMoodIds";
import MoodChart from "../../../shared/MoodChart";
import computeTrendlinePoints from "./computeTrendlinePoints";

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
  const moods = useSelector(normalizedMoodsSelector);
  const domain: [number, number] = [dateFrom.getTime(), dateTo.getTime()];
  const envelopingMoodIds = useEnvelopingMoodIds(dateFrom, dateTo);

  if (envelopingMoodIds.length < 2) return;

  const data: [number, number][] = envelopingMoodIds.map((id) => {
    const mood = moods.byId[id];
    return [new Date(id).getTime(), mood.mood];
  });

  return (
    <Paper>
      <h3>Mood chart</h3>
      <MoodChart
        centerXAxisLabels={centerXAxisLabels}
        data={data}
        domain={domain}
        hidePoints={hidePoints}
        trendlinePoints={computeTrendlinePoints(
          { ...moods, allIds: envelopingMoodIds },
          domain,
        )}
        xAxisTitle={xAxisTitle}
        xLabels={xLabels}
      />
    </Paper>
  );
}
