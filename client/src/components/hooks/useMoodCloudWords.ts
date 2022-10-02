import { useSelector } from "react-redux";
import { MINIMUM_WORD_CLOUD_WORDS } from "../../constants";
import { normalizedMoodsSelector } from "../../selectors";
import {
  getDenormalizedDataInInterval,
  getNormalizedTagsFromDescription,
} from "../../utils";

export default function useMoodCloudWords(
  fromDate: Date,
  toDate: Date
): { [word: string]: number } | undefined {
  const moods = useSelector(normalizedMoodsSelector);
  const denormalizedMoodsInCurrentPeriod = getDenormalizedDataInInterval(
    moods,
    fromDate,
    toDate
  );

  const words: { [word: string]: number } = {};

  for (const { description } of denormalizedMoodsInCurrentPeriod) {
    const normalizedDescriptionWords = description
      ? getNormalizedTagsFromDescription(description)
      : [];
    for (const caseNormalizedWord of normalizedDescriptionWords) {
      if (words[caseNormalizedWord]) words[caseNormalizedWord] += 1;
      else words[caseNormalizedWord] = 1;
    }
  }

  return Object.keys(words).length < MINIMUM_WORD_CLOUD_WORDS
    ? undefined
    : words;
}
