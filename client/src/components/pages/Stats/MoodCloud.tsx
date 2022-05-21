import { Paper, SubHeading, Toggle, WordCloud } from "eri";
import { useState } from "react";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import useMoodCloudWords from "../../hooks/useMoodCloudWords";

interface Props {
  currentPeriod: {
    fromDate: Date;
    toDate: Date;
  };
  previousPeriod: {
    fromDate: Date;
    toDate: Date;
  };
}

export default function MoodCloud({ currentPeriod, previousPeriod }: Props) {
  const [filterOutPreviousPeriod, setFilterOutPreviousPeriod] = useState(false);
  const currentPeriodWords = useMoodCloudWords(
    currentPeriod.fromDate,
    currentPeriod.toDate
  );
  const previousPeriodWords = useMoodCloudWords(
    previousPeriod.fromDate,
    previousPeriod.toDate
  );

  if (
    !currentPeriodWords ||
    Object.keys(currentPeriodWords).length < MINIMUM_WORD_CLOUD_WORDS
  )
    return null;

  const filteredWords = { ...currentPeriodWords };

  if (previousPeriodWords)
    for (const [word, count] of Object.entries(filteredWords)) {
      // eslint-disable-next-line no-prototype-builtins
      if (!previousPeriodWords.hasOwnProperty(word)) continue;

      const previousCount = previousPeriodWords[word];
      if (previousCount >= count) {
        delete filteredWords[word];
        continue;
      }
      filteredWords[word] -= previousCount;
    }

  return (
    <Paper>
      <h3>
        Mood cloud<SubHeading>Created from the mood tags you record</SubHeading>
      </h3>
      {previousPeriodWords &&
        Object.keys(filteredWords).length >= MINIMUM_WORD_CLOUD_WORDS && (
          <Toggle
            checked={filterOutPreviousPeriod}
            label="Filter out moods from previous period"
            onChange={() =>
              setFilterOutPreviousPeriod(!filterOutPreviousPeriod)
            }
          />
        )}
      <WordCloud
        aria-label="Word cloud displaying mood descriptions"
        words={filterOutPreviousPeriod ? filteredWords : currentPeriodWords}
      />
    </Paper>
  );
}
