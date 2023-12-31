import { Paper, SubHeading, Toggle, WordCloud } from "eri";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

interface Props {
  currentPeriod: {
    dateFrom: Date;
    dateTo: Date;
  };
  previousPeriod: {
    dateFrom: Date;
    dateTo: Date;
  };
}

export default function MoodCloud({ currentPeriod, previousPeriod }: Props) {
  const [filterOutPreviousPeriod, setFilterOutPreviousPeriod] = useState(false);

  const currentPeriodWords = useSelector((state: RootState) =>
    eventsSlice.selectors.moodCloudWords(
      state,
      currentPeriod.dateFrom,
      currentPeriod.dateTo,
    ),
  );
  const previousPeriodWords = useSelector((state: RootState) =>
    eventsSlice.selectors.moodCloudWords(
      state,
      previousPeriod.dateFrom,
      previousPeriod.dateTo,
    ),
  );

  if (
    !currentPeriodWords ||
    Object.keys(currentPeriodWords).length < MINIMUM_WORD_CLOUD_WORDS
  )
    return;

  const filteredWords = { ...currentPeriodWords };

  if (previousPeriodWords)
    for (const [word, count] of Object.entries(filteredWords)) {
      if (!Object.hasOwn(previousPeriodWords, word)) continue;

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
            label="Filter out moods from previous period to show what is different about this period"
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
