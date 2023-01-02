import { Paper } from "eri";
import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../../../selectors";
import useEnvelopingMoodIds from "../../../hooks/useEnvelopingMoodIds";
import MoodChart from "../../../shared/MoodChart";
import computeTrendlinePoints from "./computeTrendlinePoints";

interface Props {
  dateFrom: Date;
  dateTo: Date;
  hidePoints?: boolean;
  xAxisTitle?: string;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function MoodChartForPeriod({
  dateFrom,
  dateTo,
  hidePoints = false,
  xAxisTitle,
  xLabels,
  xLines,
}: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const domain: [number, number] = [dateFrom.getTime(), dateTo.getTime()];
  const envelopingMoodIds = useEnvelopingMoodIds(dateFrom, dateTo);

  if (envelopingMoodIds.length < 2) return null;

  const data: [number, number][] = envelopingMoodIds.map((id) => {
    const mood = moods.byId[id];
    return [new Date(id).getTime(), mood.mood];
  });

  return (
    <Paper>
      <h3>Mood chart</h3>
      <MoodChart
        data={data}
        domain={domain}
        hidePoints={hidePoints}
        trendlinePoints={computeTrendlinePoints(
          { ...moods, allIds: envelopingMoodIds },
          domain
        )}
        xAxisTitle={xAxisTitle}
        xLabels={xLabels}
        xLines={xLines}
      />
    </Paper>
  );
}
