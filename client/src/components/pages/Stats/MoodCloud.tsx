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
  const [includeExploration, setIncludeExploration] = useState(false);

  const currentPeriodAllWords = useSelector((state: RootState) =>
    eventsSlice.selectors.moodCloudWords(
      state,
      currentPeriod.dateFrom,
      currentPeriod.dateTo,
      true,
    ),
  );
  const currentPeriodWords = useSelector((state: RootState) =>
    eventsSlice.selectors.moodCloudWords(
      state,
      currentPeriod.dateFrom,
      currentPeriod.dateTo,
      includeExploration,
    ),
  );
  const previousPeriodWords = useSelector((state: RootState) =>
    eventsSlice.selectors.moodCloudWords(
      state,
      previousPeriod.dateFrom,
      previousPeriod.dateTo,
      includeExploration,
    ),
  );

  if (
    !currentPeriodAllWords ||
    Object.keys(currentPeriodAllWords).length < MINIMUM_WORD_CLOUD_WORDS
  )
    return;

  const filteredWords = { ...currentPeriodWords };

  if (previousPeriodWords)
    for (const [word, count] of Object.entries(filteredWords)) {
      if (!Object.hasOwn(previousPeriodWords, word)) continue;

      const previousCount = previousPeriodWords[word];
      if (previousCount >= count) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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
      <Toggle
        checked={includeExploration}
        label="Include mood journal words (by default only mood tags are included)"
        onChange={() => setIncludeExploration(!includeExploration)}
      />
      {previousPeriodWords &&
        Object.keys(filteredWords).length >= MINIMUM_WORD_CLOUD_WORDS && (
          <Toggle
            checked={filterOutPreviousPeriod}
            label="Subtract moods from previous period to show what is different about this period"
            onChange={() =>
              setFilterOutPreviousPeriod(!filterOutPreviousPeriod)
            }
          />
        )}
      {currentPeriodWords ? (
        <WordCloud
          aria-label="Word cloud displaying mood descriptions"
          words={filterOutPreviousPeriod ? filteredWords : currentPeriodWords}
        />
      ) : (
        <p>
          <small>No words, try toggling to include mood journal words</small>
        </p>
      )}
    </Paper>
  );
}
