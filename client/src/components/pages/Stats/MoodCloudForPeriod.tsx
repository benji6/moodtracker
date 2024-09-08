import { Paper, Toggle, WordCloud } from "eri";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodCloudForPeriod({ dateFrom, dateTo }: Props) {
  const [includeExploration, setIncludeExploration] = useState(false);
  const words = useSelector((state: RootState) =>
    eventsSlice.selectors.moodCloudWords(
      state,
      dateFrom,
      dateTo,
      includeExploration,
    ),
  );

  if (!words || Object.keys(words).length < MINIMUM_WORD_CLOUD_WORDS) return;

  return (
    <Paper>
      <h3>Mood cloud</h3>
      <Toggle
        checked={includeExploration}
        label="Include mood journal words (by default only mood tags are included)"
        onChange={() => setIncludeExploration(!includeExploration)}
      />
      <WordCloud
        aria-label="Word cloud displaying mood descriptions"
        words={words}
      />
    </Paper>
  );
}
