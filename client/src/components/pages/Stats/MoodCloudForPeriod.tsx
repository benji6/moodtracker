import { Paper, WordCloud } from "eri";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodCloudForPeriod({ dateFrom, dateTo }: Props) {
  const navigate = useNavigate();
  const words = useSelector((state: RootState) =>
    eventsSlice.selectors.moodCloudWords(state, dateFrom, dateTo),
  );

  if (!words || Object.keys(words).length < MINIMUM_WORD_CLOUD_WORDS) return;

  return (
    <Paper>
      <h3>Mood cloud</h3>
      <WordCloud
        aria-label="Word cloud displaying mood descriptions"
        onWordClick={(word) =>
          navigate(
            `/moods/log?${new URLSearchParams({
              dateFrom: dateFrom.toISOString().split("T", 1)[0],
              dateTo: dateTo.toISOString().split("T", 1)[0],
              q: `'${word}`,
            })}`,
          )
        }
        words={words}
      />
    </Paper>
  );
}
