import differenceInHours from "date-fns/differenceInHours";
import { Paper, WordCloud } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import { twoDecimalPlacesFormatter } from "../../../numberFormatters";
import {
  normalizedMeditationsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import {
  computeMean,
  counter,
  getNormalizedTagsFromDescription,
} from "../../../utils";

const HOURS = 4;

export default function MeditationStats() {
  const meditations = useSelector(normalizedMeditationsSelector);
  const moods = useSelector(normalizedMoodsSelector);

  if (!meditations.allIds.length) return null;

  const moodChanges: number[] = [];
  let wordsBefore: string[] = [];
  let wordsAfter: string[] = [];
  let i = 0;
  for (const meditationId of meditations.allIds) {
    for (; i < moods.allIds.length; i++) {
      const moodAfterId = moods.allIds[i];
      if (moodAfterId < meditationId || i === 0) continue;
      const moodBeforeId = moods.allIds[i - 1];
      const moodBefore = moods.byId[moodBeforeId];
      const moodAfter = moods.byId[moodAfterId];
      const meditationDate = new Date(meditationId);
      const differenceBefore = differenceInHours(
        meditationDate,
        new Date(moodBeforeId)
      );
      const differenceAfter = differenceInHours(
        new Date(moodAfterId),
        meditationDate
      );

      if (differenceBefore > HOURS || differenceAfter > HOURS) break;

      moodChanges.push(moodAfter.mood - moodBefore.mood);

      if (moodBefore.description)
        wordsBefore = wordsBefore.concat(
          getNormalizedTagsFromDescription(moodBefore.description)
        );
      if (moodAfter.description)
        wordsAfter = wordsAfter.concat(
          getNormalizedTagsFromDescription(moodAfter.description)
        );
      break;
    }
  }

  const averageMoodChangeAfterMeditation = computeMean(moodChanges);

  if (averageMoodChangeAfterMeditation === undefined) return null;

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
        Only moods that are recorded up to {HOURS} hours before meditation and
        up to {HOURS} hours after are counted.
      </p>
    </Paper>
  );
}
