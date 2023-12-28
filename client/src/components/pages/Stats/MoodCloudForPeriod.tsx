import { Paper, SubHeading, WordCloud } from "eri";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodCloudForPeriod({ dateFrom, dateTo }: Props) {
  const words = useSelector((state: RootState) =>
    eventsSlice.selectors.moodCloudWords(state, dateFrom, dateTo),
  );

  if (!words || Object.keys(words).length < MINIMUM_WORD_CLOUD_WORDS) return;

  return (
    <Paper>
      <h3>
        Mood cloud<SubHeading>Created from the mood tags you record</SubHeading>
      </h3>
      <WordCloud
        aria-label="Word cloud displaying mood descriptions"
        words={words}
      />
    </Paper>
  );
}
