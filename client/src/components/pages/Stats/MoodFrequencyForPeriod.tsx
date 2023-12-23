import { MOOD_INTEGERS, MOOD_RANGE } from "../../../constants";
import MoodFrequencyChart from "../../shared/MoodFrequencyChart";
import { Paper } from "eri";
import useMoodsInPeriod from "../../hooks/useMoodsInPeriod";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodFrequencyForPeriod({ dateFrom, dateTo }: Props) {
  const moodsInPeriod = useMoodsInPeriod(dateFrom, dateTo);

  const moodCounter = new Map(MOOD_INTEGERS.map((n) => [MOOD_RANGE[0] + n, 0]));

  for (const { mood } of moodsInPeriod) {
    // handle old data stored in decimal format
    const rounded = Math.round(mood);
    moodCounter.set(rounded, moodCounter.get(rounded)! + 1);
  }

  return (
    <Paper>
      <h3>Mood frequency</h3>
      <MoodFrequencyChart data={[...moodCounter.values()]} />
    </Paper>
  );
}
