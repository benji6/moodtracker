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
import {
  oneDecimalPlaceFormatter,
  percentFormatter,
} from "../../../formatters/numberFormatters";
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
  const denormalizedMoodsOrderedByExperiencedAt = useSelector(
    eventsSlice.selectors.denormalizedMoodsOrderedByExperiencedAt,
  );
  const [shouldRemoveSharedWords, setShouldRemoveSharedWords] = useState(true);
  const meditationIdsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meditationIdsInPeriod(state, dateFrom, dateTo),
  );

  if (
    !meditationIdsInPeriod.length ||
    !denormalizedMoodsOrderedByExperiencedAt.length
  )
    return (
      <Paper>
        <p>Not enough data to assess meditation impact for this period</p>
      </Paper>
    );

  const moodsBefore: number[] = [];
  const moodsAfter: number[] = [];
  const wordsBeforeList: string[] = [];
  const wordsAfterList: string[] = [];
  let i = 0;
  for (const meditationId of meditationIdsInPeriod) {
    for (; i < denormalizedMoodsOrderedByExperiencedAt.length; i++) {
      const moodAfter = denormalizedMoodsOrderedByExperiencedAt[i];
      if (moodAfter.experiencedAt < meditationId || i === 0) continue;
      const moodBefore = denormalizedMoodsOrderedByExperiencedAt[i - 1];
      const meditationLogDate = new Date(meditationId);
      const meditationStartDate = sub(meditationLogDate, {
        seconds: meditations.byId[meditationId].seconds,
      });

      // We use differenceInSeconds instead of differenceInHours as the latter
      // rounds values down (i.e. a 4.4 hour difference is returned as 4 hours).
      const differenceBefore = differenceInSeconds(
        meditationStartDate,
        new Date(moodBefore.experiencedAt),
      );
      const differenceAfter = differenceInSeconds(
        new Date(moodAfter.experiencedAt),
        meditationLogDate,
      );

      if (differenceBefore > SECONDS || differenceAfter > SECONDS) break;

      moodsBefore.push(moodBefore.mood);
      moodsAfter.push(moodAfter.mood);

      if (moodBefore.description)
        for (const word of getNormalizedWordCloudWords(moodBefore.description))
          wordsBeforeList.push(word);
      if (moodBefore.exploration)
        for (const word of getNormalizedWordCloudWords(moodBefore.exploration))
          wordsBeforeList.push(word);
      if (moodAfter.description)
        for (const word of getNormalizedWordCloudWords(moodAfter.description))
          wordsAfterList.push(word);
      if (moodAfter.exploration)
        for (const word of getNormalizedWordCloudWords(moodAfter.exploration))
          wordsAfterList.push(word);
      break;
    }
  }

  if (!moodsBefore.length)
    return (
      <Paper>
        <p>Not enough data to assess meditation impact for this period</p>
      </Paper>
    );

  const averageMoodBefore = computeMean(moodsBefore);
  const averageMoodAfter = computeMean(moodsAfter);
  const averageMoodChangeAfterMeditation = averageMoodAfter - averageMoodBefore;

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
              (
              {percentFormatter.format(
                averageMoodChangeAfterMeditation / averageMoodBefore,
              )}
              ) {averageMoodChangeAfterMeditation > 0 ? "higher" : "lower"}
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
