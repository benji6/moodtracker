import differenceInSeconds from "date-fns/differenceInSeconds";
import sub from "date-fns/sub";
import { Paper, SubHeading, Toggle, WordCloud } from "eri";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MINIMUM_WORD_CLOUD_WORDS, TIME } from "../../../constants";
import { oneDecimalPlaceFormatter } from "../../../formatters/numberFormatters";
import {
  normalizedMeditationsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import {
  computeMean,
  counter,
  getNormalizedTagsFromDescription,
} from "../../../utils";
import useMeditationIdsInPeriod from "../../hooks/useMeditationIdsInPeriod";

const MEDITATION_STATS_HOURS_RANGE = 4;
const SECONDS = MEDITATION_STATS_HOURS_RANGE * TIME.secondsPerHour;

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MeditationImpactForPeriod({ dateFrom, dateTo }: Props) {
  const meditations = useSelector(normalizedMeditationsSelector);
  const moods = useSelector(normalizedMoodsSelector);
  const [shouldRemoveSharedWords, setShouldRemoveSharedWords] = useState(true);
  const meditationIdsInPeriod = useMeditationIdsInPeriod(dateFrom, dateTo);

  if (!meditationIdsInPeriod.length || !moods.allIds.length) return null;

  const moodChanges: number[] = [];
  let wordsBeforeList: string[] = [];
  let wordsAfterList: string[] = [];
  let i = 0;
  for (const meditationId of meditationIdsInPeriod) {
    for (; i < moods.allIds.length; i++) {
      const moodAfterId = moods.allIds[i];
      if (moodAfterId < meditationId || i === 0) continue;
      const moodBeforeId = moods.allIds[i - 1];
      const moodBefore = moods.byId[moodBeforeId];
      const moodAfter = moods.byId[moodAfterId];
      const meditationLogDate = new Date(meditationId);
      const meditationStartDate = sub(meditationLogDate, {
        seconds: meditations.byId[meditationId].seconds,
      });

      // We use differenceInSeconds instead of differenceInHours as the latter
      // rounds values down (i.e. a 4.4 hour difference is returned as 4 hours).
      const differenceBefore = differenceInSeconds(
        meditationStartDate,
        new Date(moodBeforeId),
      );
      const differenceAfter = differenceInSeconds(
        new Date(moodAfterId),
        meditationLogDate,
      );

      if (differenceBefore > SECONDS || differenceAfter > SECONDS) break;

      moodChanges.push(moodAfter.mood - moodBefore.mood);

      if (moodBefore.description)
        wordsBeforeList = wordsBeforeList.concat(
          getNormalizedTagsFromDescription(moodBefore.description),
        );
      if (moodAfter.description)
        wordsAfterList = wordsAfterList.concat(
          getNormalizedTagsFromDescription(moodAfter.description),
        );
      break;
    }
  }

  if (!moodChanges.length) return null;

  const averageMoodChangeAfterMeditation = computeMean(moodChanges);

  const wordsAfter = counter(wordsAfterList);
  const wordsBefore = counter(wordsBeforeList);

  const filteredWordsAfter = { ...wordsAfter };
  const filteredWordsBefore = { ...wordsBefore };

  for (const word of new Set(wordsBeforeList)) {
    // eslint-disable-next-line no-prototype-builtins
    if (!wordsAfter.hasOwnProperty(word)) continue;
    const afterCount = wordsAfter[word];
    const beforeCount = wordsBefore[word];

    if (afterCount === beforeCount) {
      delete filteredWordsAfter[word];
      delete filteredWordsBefore[word];
      continue;
    }

    const lowestCount = Math.min(afterCount, beforeCount);

    if (afterCount === lowestCount) {
      delete filteredWordsAfter[word];
      filteredWordsBefore[word] -= lowestCount;
    }
    if (beforeCount === lowestCount) {
      delete filteredWordsBefore[word];
      filteredWordsAfter[word] -= lowestCount;
    }
  }

  return (
    <Paper>
      <h3>
        Meditation impact
        <SubHeading>
          Based on {meditationIdsInPeriod.length} meditation
          {meditationIdsInPeriod.length === 1 ? "" : "s"}
        </SubHeading>
      </h3>
      <p>
        {Math.abs(Math.round(averageMoodChangeAfterMeditation * 10)) === 0 ? (
          <>On average meditation has not made much impact on your mood.</>
        ) : (
          <>
            On average the mood you recorded after meditation was{" "}
            <b>
              {oneDecimalPlaceFormatter.format(
                Math.abs(averageMoodChangeAfterMeditation),
              )}{" "}
              {averageMoodChangeAfterMeditation > 0 ? "higher" : "lower"}
            </b>{" "}
            than the mood you recorded before.
          </>
        )}
      </p>
      {Object.keys(filteredWordsAfter).length >= MINIMUM_WORD_CLOUD_WORDS &&
        Object.keys(filteredWordsBefore).length >= MINIMUM_WORD_CLOUD_WORDS && (
          <>
            <h4>Mood clouds</h4>
            <Toggle
              checked={shouldRemoveSharedWords}
              label="Filter out moods that are shared between both clouds"
              onChange={() =>
                setShouldRemoveSharedWords(!shouldRemoveSharedWords)
              }
            />
            <h5>Before meditation</h5>
            <WordCloud
              aria-label="Word cloud displaying mood descriptions before meditation"
              words={
                shouldRemoveSharedWords ? filteredWordsBefore : wordsBefore
              }
            />
            <h5>After meditation</h5>
            <WordCloud
              aria-label="Word cloud displaying mood descriptions after meditation"
              words={shouldRemoveSharedWords ? filteredWordsAfter : wordsAfter}
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
