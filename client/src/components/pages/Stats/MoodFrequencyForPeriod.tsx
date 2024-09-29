import { MOOD_INTEGERS } from "../../../constants";
import MoodFrequencyChart from "../../shared/MoodFrequencyChart";
import { Paper } from "eri";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodFrequencyForPeriod({ dateFrom, dateTo }: Props) {
  const moodsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, dateFrom, dateTo),
  );

  if (!moodsInPeriod.length) return;

  const moodCounter = MOOD_INTEGERS.map(() => 0);
  for (const { mood } of moodsInPeriod) {
    // round to handle old data stored in decimal format
    moodCounter[Math.round(mood)] += 1;
  }

  return (
    <Paper>
      <h3>Mood frequency</h3>
      <MoodFrequencyChart data={moodCounter} />
    </Paper>
  );
}
