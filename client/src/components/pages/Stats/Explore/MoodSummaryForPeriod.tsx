import {
  computeCompletePopulationStandardDeviation,
  computeMeanSafe,
} from "../../../../utils";
import MoodSummary from "../../../shared/MoodSummary";
import { Paper } from "eri";
import { RootState } from "../../../../store";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodSummaryForPeriod({ dateFrom, dateTo }: Props) {
  const moodValues = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, dateFrom, dateTo),
  ).map(({ mood }) => mood);
  const meanSleep = useSelector((state: RootState) =>
    eventsSlice.selectors.meanDailySleepDurationInPeriod(
      state,
      dateFrom,
      dateTo,
    ),
  );
  const meanWeight = useSelector((state: RootState) =>
    eventsSlice.selectors.meanWeightInPeriod(state, dateFrom, dateTo),
  );
  const secondsMeditated = useSelector((state: RootState) =>
    eventsSlice.selectors.secondsMeditatedInPeriod(state, dateFrom, dateTo),
  );
  const totalPushUps = useSelector((state: RootState) =>
    eventsSlice.selectors.totalPushUpsInPeriod(state, dateFrom, dateTo),
  );
  return (
    <Paper>
      <h3>Summary</h3>
      {!moodValues.length && !moodValues.length && meanWeight === undefined && (
        <p>No data for the selected period</p>
      )}
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: computeMeanSafe(moodValues),
          meanWeight,
          meanSleep,
          secondsMeditated,
          standardDeviation:
            computeCompletePopulationStandardDeviation(moodValues),
          total: moodValues.length,
          totalPushUps,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
      />
    </Paper>
  );
}
