import { Paper, Toggle, WordCloud } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  MEDITATION_STATS_HOURS_RANGE,
  MINIMUM_WORD_CLOUD_WORDS,
} from "../../../../constants";
import { twoDecimalPlacesFormatter } from "../../../../numberFormatters";
import { meditationStatsSelector } from "../../../../selectors";

export default function MeditationStats() {
  const {
    averageMoodChangeAfterMeditation,
    filteredWordsAfter,
    filteredWordsBefore,
    wordsAfter,
    wordsBefore,
  } = useSelector(meditationStatsSelector);
  const [shouldRemoveSharedWords, setShouldRemoveSharedWords] =
    React.useState(true);

  // This case should never happen
  if (averageMoodChangeAfterMeditation === undefined) return null;

  return (
    <Paper>
      <h3>Impact</h3>
      <p>
        {Math.abs(Math.round(averageMoodChangeAfterMeditation * 100)) === 0 ? (
          "On average there is not a big difference between the moods you record before meditation and the ones you record after meditation"
        ) : (
          <>
            On average the mood you record after meditation is{" "}
            <b>
              {twoDecimalPlacesFormatter.format(
                Math.abs(averageMoodChangeAfterMeditation)
              )}{" "}
              {averageMoodChangeAfterMeditation > 0 ? "higher" : "lower"}
            </b>{" "}
            than the mood you record before.
          </>
        )}
      </p>
      {Object.keys(filteredWordsAfter).length > MINIMUM_WORD_CLOUD_WORDS &&
        Object.keys(filteredWordsBefore).length > MINIMUM_WORD_CLOUD_WORDS && (
          <>
            <h3>Mood clouds</h3>
            <Toggle
              checked={shouldRemoveSharedWords}
              label="Filter out shared moods"
              onChange={() =>
                setShouldRemoveSharedWords(!shouldRemoveSharedWords)
              }
            />
            <h4>Before meditation</h4>
            <WordCloud
              aria-label="Word cloud displaying mood descriptions before meditation"
              words={
                shouldRemoveSharedWords ? filteredWordsBefore : wordsBefore
              }
            />
            <h4>After meditation</h4>
            <WordCloud
              aria-label="Word cloud displaying mood descriptions after meditation"
              words={shouldRemoveSharedWords ? filteredWordsAfter : wordsAfter}
            />
          </>
        )}
      <h3>Method</h3>
      <p>
        Only moods that are recorded up to {MEDITATION_STATS_HOURS_RANGE} hours
        before meditation and up to {MEDITATION_STATS_HOURS_RANGE} hours after
        are counted.
      </p>
    </Paper>
  );
}
