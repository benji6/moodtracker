import { Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../../constants";
import { moodsSelector } from "../../../selectors";
import { getMoodIdsInInterval } from "../../../utils";
import MoodFrequencyChart from "../../shared/MoodFrequencyChart";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodFrequencyForPeriod({ fromDate, toDate }: Props) {
  const moods = useSelector(moodsSelector);

  const moodIdsInPeriod = getMoodIdsInInterval(moods.allIds, fromDate, toDate);

  const moodValues = moodIdsInPeriod.map((id) => moods.byId[id].mood);
  const moodCounter = new Map(MOOD_INTEGERS.map((n) => [MOOD_RANGE[0] + n, 0]));

  for (const moodValue of moodValues) {
    // handle old data stored in decimal format
    const rounded = Math.round(moodValue);
    moodCounter.set(rounded, moodCounter.get(rounded)! + 1);
  }

  return (
    <Paper>
      <h3>Mood frequency</h3>
      <MoodFrequencyChart data={[...moodCounter.values()]} />
    </Paper>
  );
}
