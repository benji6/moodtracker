import { MINIMUM_WORD_CLOUD_WORDS } from "../../constants";
import { getNormalizedTagsFromDescription } from "../../utils";
import useMoodsInPeriod from "./useMoodsInPeriod";

export default function useMoodCloudWords(
  fromDate: Date,
  toDate: Date
): { [word: string]: number } | undefined {
  const moodsInPeriod = useMoodsInPeriod(fromDate, toDate);

  const words: { [word: string]: number } = {};
  for (const { description } of moodsInPeriod) {
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
