import { Paper, SubHeading, Toggle, WordCloud } from "eri";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

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
          onWordClick={(word) =>
            navigate(
              `/moods/log?${new URLSearchParams({
                dateFrom: currentPeriod.dateFrom.toISOString().split("T", 1)[0],
                dateTo: currentPeriod.dateTo.toISOString().split("T", 1)[0],
                q: `'${word}`,
              })}`,
            )
          }
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
