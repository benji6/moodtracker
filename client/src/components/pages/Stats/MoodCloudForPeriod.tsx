import { Paper, SubHeading, WordCloud } from "eri";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import useMoodCloudWords from "../../hooks/useMoodCloudWords";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodCloudForPeriod({ fromDate, toDate }: Props) {
  const currentPeriodWords = useMoodCloudWords(fromDate, toDate);

  if (
    !currentPeriodWords ||
    Object.keys(currentPeriodWords).length < MINIMUM_WORD_CLOUD_WORDS
  )
    return null;

  return (
    <Paper>
      <h3>
        Mood cloud<SubHeading>Created from the mood tags you record</SubHeading>
      </h3>
      <WordCloud
        aria-label="Word cloud displaying mood descriptions"
        words={currentPeriodWords}
      />
    </Paper>
  );
}
