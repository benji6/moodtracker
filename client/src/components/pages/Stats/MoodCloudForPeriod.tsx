import { Paper, WordCloud } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../../selectors";
import {
  getMoodIdsInInterval,
  getNormalizedDescriptionWordsFromMood,
} from "../../../utils";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodCloudForPeriod({ fromDate, toDate }: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const moodIdsInPeriod = getMoodIdsInInterval(moods.allIds, fromDate, toDate);

  const words: { [word: string]: number } = {};

  for (const id of moodIdsInPeriod) {
    const normalizedDescriptionWords = getNormalizedDescriptionWordsFromMood(
      moods.byId[id]
    );
    for (const caseNormalizedWord of normalizedDescriptionWords) {
      if (words[caseNormalizedWord]) words[caseNormalizedWord] += 1;
      else words[caseNormalizedWord] = 1;
    }
  }

  if (Object.keys(words).length < 5) return null;

  return (
    <Paper>
      <h3>Mood cloud</h3>
      <WordCloud
        aria-label="Word cloud displaying mood descriptions"
        words={words}
      />
    </Paper>
  );
}
