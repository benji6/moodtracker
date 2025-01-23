import { Paper } from "eri";
import { RootState } from "../../../store";
import Summary from "../../shared/Summary";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function ExerciseForPeriod({ dateFrom, dateTo }: Props) {
  const runMeters = useSelector((state: RootState) =>
    eventsSlice.selectors.runMetersInPeriod(state, dateFrom, dateTo),
  );
  const runSeconds = useSelector((state: RootState) =>
    eventsSlice.selectors.runSecondsInPeriod(state, dateFrom, dateTo),
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
      <h3>Exercise</h3>
      {!runMeters &&
        !runSeconds &&
        !totalPushUps &&
        !totalSitUps &&
        !totalLegRaises && <p>No data for the selected period</p>}
      <Summary
        currentPeriod={{
          runMeters,
          runSeconds,
          totalLegRaises,
          totalPushUps,
          totalSitUps,
        }}
      />
    </Paper>
  );
}
