import { MINIMUM_WORD_CLOUD_WORDS, TIME } from "../../../constants";
import { Paper, SubHeading, Toggle, WordCloud } from "eri";
import {
  computeMean,
  counter,
  getNormalizedWordCloudWords,
} from "../../../utils";
import { differenceInSeconds, sub } from "date-fns";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { oneDecimalPlaceFormatter } from "../../../formatters/numberFormatters";
import { useSelector } from "react-redux";
import { useState } from "react";

const MEDITATION_STATS_HOURS_RANGE = 4;
const SECONDS = MEDITATION_STATS_HOURS_RANGE * TIME.secondsPerHour;

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MeditationImpactForPeriod({ dateFrom, dateTo }: Props) {
  const meditations = useSelector(eventsSlice.selectors.normalizedMeditations);
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
  const [includeExploration, setIncludeExploration] = useState(false);
  const [shouldRemoveSharedWords, setShouldRemoveSharedWords] = useState(true);
  const meditationIdsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meditationIdsInPeriod(state, dateFrom, dateTo),
  );

  if (!meditationIdsInPeriod.length || !moods.allIds.length) return;

  const moodChanges: number[] = [];
  const wordsBeforeList: string[] = [];
  const wordsAfterList: string[] = [];
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
        for (const word of getNormalizedWordCloudWords(moodBefore.description))
          wordsBeforeList.push(word);
      if (includeExploration && moodBefore.exploration)
        for (const word of getNormalizedWordCloudWords(moodBefore.exploration))
          wordsBeforeList.push(word);
      if (moodAfter.description)
        for (const word of getNormalizedWordCloudWords(moodAfter.description))
          wordsAfterList.push(word);
      if (includeExploration && moodAfter.exploration)
        for (const word of getNormalizedWordCloudWords(moodAfter.exploration))
          wordsAfterList.push(word);
      break;
    }
  }

  if (moodChanges.length)
    return (
      <Paper>
        <p>Not enough data to assess meditation impact for this period</p>
      </Paper>
    );

  const averageMoodChangeAfterMeditation = computeMean(moodChanges);

  const wordsAfter = counter(wordsAfterList);
  const wordsBefore = counter(wordsBeforeList);

  const filteredWordsAfter = { ...wordsAfter };
  const filteredWordsBefore = { ...wordsBefore };

  for (const word of new Set(wordsBeforeList)) {
    if (!Object.hasOwn(wordsAfter, word)) continue;
    const afterCount = wordsAfter[word];
    const beforeCount = wordsBefore[word];

    if (afterCount === beforeCount) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filteredWordsAfter[word];
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filteredWordsBefore[word];
      continue;
    }

    const lowestCount = Math.min(afterCount, beforeCount);

    if (afterCount === lowestCount) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filteredWordsAfter[word];
      filteredWordsBefore[word] -= lowestCount;
    }
    if (beforeCount === lowestCount) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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
              checked={includeExploration}
              label="Include mood journal words (by default only mood tags are included)"
              onChange={() => setIncludeExploration(!includeExploration)}
            />
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
