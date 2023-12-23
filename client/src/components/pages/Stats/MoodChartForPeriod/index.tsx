import MoodChart from "../../../shared/MoodChart";
import { Paper } from "eri";
import computeTrendlinePoints from "./computeTrendlinePoints";
import eventsSlice from "../../../../store/eventsSlice";
import useEnvelopingMoodIds from "../../../hooks/useEnvelopingMoodIds";
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
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
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
