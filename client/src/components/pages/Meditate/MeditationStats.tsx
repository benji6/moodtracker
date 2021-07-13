import { Paper, WordCloud } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  MEDITATION_STATS_HOURS_RANGE,
  MINIMUM_WORD_CLOUD_WORDS,
} from "../../../constants";
import { twoDecimalPlacesFormatter } from "../../../numberFormatters";
import {
  meditationStatsSelector,
  normalizedMeditationsSelector,
} from "../../../selectors";
import { counter } from "../../../utils";

export default function MeditationStats() {
  const meditations = useSelector(normalizedMeditationsSelector);
  const { averageMoodChangeAfterMeditation, wordsAfter, wordsBefore } =
    useSelector(meditationStatsSelector);

  if (
    !meditations.allIds.length ||
    averageMoodChangeAfterMeditation === undefined
  )
    return null;

  return (
    <Paper>
      <h3>Stats</h3>
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
      {wordsBefore.length > MINIMUM_WORD_CLOUD_WORDS &&
        wordsAfter.length > MINIMUM_WORD_CLOUD_WORDS && (
          <>
            <h4>Mood cloud before meditation</h4>
            <WordCloud
              aria-label="Word cloud displaying mood descriptions before meditation"
              words={counter(wordsBefore)}
            />
            <h4>Mood cloud after meditation</h4>
            <WordCloud
              aria-label="Word cloud displaying mood descriptions after meditation"
              words={counter(wordsAfter)}
            />
          </>
        )}
      <h4>Method</h4>
      <p>
        Only moods that are recorded up to {MEDITATION_STATS_HOURS_RANGE} hours
        before meditation and up to {MEDITATION_STATS_HOURS_RANGE} hours after
        are counted.
      </p>
    </Paper>
  );
}
