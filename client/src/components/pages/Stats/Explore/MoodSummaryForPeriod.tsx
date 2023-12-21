import { Paper } from "eri";
import { useSelector } from "react-redux";
import {
  computeStandardDeviation,
  computeSecondsMeditatedInInterval,
  computeMeanSafe,
} from "../../../../utils";
import useMoodsInPeriod from "../../../hooks/useMoodsInPeriod";
import useWeightsInPeriod from "../../../hooks/useWeightsInPeriod";
import MoodSummary from "../../../shared/MoodSummary";
import eventsSlice from "../../../../store/eventsSlice";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodSummaryForPeriod({ dateFrom, dateTo }: Props) {
  const meditations = useSelector(eventsSlice.selectors.normalizedMeditations);
  const moodValues = useMoodsInPeriod(dateFrom, dateTo).map(({ mood }) => mood);
  const weightsInPeriod = useWeightsInPeriod(dateFrom, dateTo).map(
    ({ value }) => value,
  );
  const secondsMeditated = computeSecondsMeditatedInInterval(
    meditations,
    dateFrom,
    dateTo,
  );

  return (
    <Paper>
      <h3>Summary</h3>
      {!moodValues.length && !moodValues.length && !weightsInPeriod.length && (
        <p>No data for the selected period</p>
      )}
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: computeMeanSafe(moodValues),
          meanWeight: computeMeanSafe(weightsInPeriod),
          secondsMeditated,
          standardDeviation: computeStandardDeviation(moodValues),
          total: moodValues.length,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
      />
    </Paper>
  );
}
