import { Paper, WordCloud } from "eri";
import { useSelector } from "react-redux";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../../constants";
import { normalizedMoodsSelector } from "../../../selectors";
import {
  getIdsInInterval,
  getNormalizedTagsFromDescription,
} from "../../../utils";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodCloudForPeriod({ fromDate, toDate }: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const moodIdsInPeriod = getIdsInInterval(moods.allIds, fromDate, toDate);

  const words: { [word: string]: number } = {};

  for (const id of moodIdsInPeriod) {
    const { description } = moods.byId[id];
    const normalizedDescriptionWords = description
      ? getNormalizedTagsFromDescription(description)
      : [];
    for (const caseNormalizedWord of normalizedDescriptionWords) {
      if (words[caseNormalizedWord]) words[caseNormalizedWord] += 1;
      else words[caseNormalizedWord] = 1;
    }
  }

  if (Object.keys(words).length < MINIMUM_WORD_CLOUD_WORDS) return null;

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
