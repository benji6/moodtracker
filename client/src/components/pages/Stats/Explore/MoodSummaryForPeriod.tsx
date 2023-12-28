import {
  computeMeanSafe,
  computeSecondsMeditatedInInterval,
  computeStandardDeviation,
} from "../../../../utils";
import MoodSummary from "../../../shared/MoodSummary";
import { Paper } from "eri";
import { RootState } from "../../../../store";
import eventsSlice from "../../../../store/eventsSlice";
import useMoodsInPeriod from "../../../hooks/useMoodsInPeriod";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodSummaryForPeriod({ dateFrom, dateTo }: Props) {
  const meditations = useSelector(eventsSlice.selectors.normalizedMeditations);
  const moodValues = useMoodsInPeriod(dateFrom, dateTo).map(({ mood }) => mood);
  const meanWeightInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meanWeightInPeriod(state, dateFrom, dateTo),
  );
  const secondsMeditated = computeSecondsMeditatedInInterval(
    meditations,
    dateFrom,
    dateTo,
  );

  return (
    <Paper>
      <h3>Summary</h3>
      {!moodValues.length &&
        !moodValues.length &&
        meanWeightInPeriod === undefined && (
          <p>No data for the selected period</p>
        )}
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: computeMeanSafe(moodValues),
          meanWeight: meanWeightInPeriod,
          secondsMeditated,
          standardDeviation: computeStandardDeviation(moodValues),
          total: moodValues.length,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
      />
    </Paper>
  );
}
