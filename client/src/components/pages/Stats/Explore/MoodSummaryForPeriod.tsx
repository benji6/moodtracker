import {
  computeMeanSafe,
  computeSecondsMeditatedInInterval,
  computeStandardDeviation,
} from "../../../../utils";
import MoodSummary from "../../../shared/MoodSummary";
import { Paper } from "eri";
import eventsSlice from "../../../../store/eventsSlice";
import useMoodsInPeriod from "../../../hooks/useMoodsInPeriod";
import { useSelector } from "react-redux";
import useWeightsInPeriod from "../../../hooks/useWeightsInPeriod";

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
