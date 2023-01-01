import { Paper } from "eri";
import { useSelector } from "react-redux";
import { normalizedMeditationsSelector } from "../../../../selectors";
import {
  computeStandardDeviation,
  computeSecondsMeditatedInInterval,
  computeMean,
} from "../../../../utils";
import useMoodsInPeriod from "../../../hooks/useMoodsInPeriod";
import useWeightsInPeriod from "../../../hooks/useWeightsInPeriod";
import MoodSummary from "../../../shared/MoodSummary";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodSummaryForPeriod({ fromDate, toDate }: Props) {
  const meditations = useSelector(normalizedMeditationsSelector);
  const moodValues = useMoodsInPeriod(fromDate, toDate).map(({ mood }) => mood);
  const weightsInPeriod = useWeightsInPeriod(fromDate, toDate).map(
    ({ value }) => value
  );
  const secondsMeditated = computeSecondsMeditatedInInterval(
    meditations,
    fromDate,
    toDate
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
          mean: computeMean(moodValues),
          meanWeight: computeMean(weightsInPeriod),
          secondsMeditated,
          standardDeviation: computeStandardDeviation(moodValues),
          total: moodValues.length,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
      />
    </Paper>
  );
}
