import {
  computeCompletePopulationStandardDeviation,
  computeMeanSafe,
} from "../../../../utils";
import { Paper } from "eri";
import { RootState } from "../../../../store";
import Summary from "../../../shared/Summary";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function SummaryForPeriod({ dateFrom, dateTo }: Props) {
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
  const runMeters = useSelector((state: RootState) =>
    eventsSlice.selectors.runMetersInPeriod(state, dateFrom, dateTo),
  );
  const runSeconds = useSelector((state: RootState) =>
    eventsSlice.selectors.runSecondsInPeriod(state, dateFrom, dateTo),
  );
  const secondsMeditated = useSelector((state: RootState) =>
    eventsSlice.selectors.secondsMeditatedInPeriod(state, dateFrom, dateTo),
  );
  const totalLegRaises = useSelector((state: RootState) =>
    eventsSlice.selectors.totalLegRaisesInPeriod(state, dateFrom, dateTo),
  );
  const totalPushUps = useSelector((state: RootState) =>
    eventsSlice.selectors.totalPushUpsInPeriod(state, dateFrom, dateTo),
  );
  const totalSitUps = useSelector((state: RootState) =>
    eventsSlice.selectors.totalSitUpsInPeriod(state, dateFrom, dateTo),
  );
  return (
    <Paper>
      <h3>Summary</h3>
      {!moodValues.length && !moodValues.length && meanWeight === undefined && (
        <p>No data for the selected period</p>
      )}
      <Summary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: computeMeanSafe(moodValues),
          meanWeight,
          meanSleep,
          runMeters,
          runSeconds,
          secondsMeditated,
          standardDeviation:
            computeCompletePopulationStandardDeviation(moodValues),
          total: moodValues.length,
          totalLegRaises,
          totalPushUps,
          totalSitUps,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
      />
    </Paper>
  );
}
