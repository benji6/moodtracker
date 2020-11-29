import { Paper, WordCloud } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { moodsSelector } from "../../../selectors";
import { getMoodIdsInInterval } from "../../../utils";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodCloudForPeriod({ fromDate, toDate }: Props) {
  const moods = useSelector(moodsSelector);
  const moodIdsInPeriod = getMoodIdsInInterval(moods.allIds, fromDate, toDate);

  const words: { [word: string]: number } = {};

  for (const id of moodIdsInPeriod) {
    const { description } = moods.byId[id];
    if (!description) continue;
    for (const word of description.split(/\s+/)) {
      const caseNormalizedWord = `${word[0].toUpperCase()}${word
        .toLowerCase()
        .slice(1)}`;
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
