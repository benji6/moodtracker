import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../../../selectors";
import { getEnvelopingCategoryIds } from "../../../../utils";
import MoodChart from "../../../shared/MoodChart";
import computeTrendlinePoints from "./computeTrendlinePoints";

interface Props {
  fromDate: Date;
  hidePoints?: boolean;
  toDate: Date;
  xAxisTitle?: string;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function MoodChartForPeriod({
  fromDate,
  hidePoints = false,
  toDate,
  xAxisTitle,
  xLabels,
  xLines,
}: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const domain: [number, number] = [fromDate.getTime(), toDate.getTime()];
  const envelopingMoodIds = getEnvelopingCategoryIds(
    moods.allIds,
    fromDate,
    toDate
  );
  const data: [number, number][] = envelopingMoodIds.map((id) => {
    const mood = moods.byId[id];
    return [new Date(id).getTime(), mood.mood];
  });

  return (
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
  );
}
