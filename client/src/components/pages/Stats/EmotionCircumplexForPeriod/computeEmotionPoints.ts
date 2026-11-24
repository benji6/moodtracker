import { EmotionPoint } from "../../../shared/EmotionCircumplexChart/types";
import { Mood } from "../../../../types";
import { emotions } from "./emotions";

const emotionIdsByWord = new Map(
  emotions.flatMap(({ id, aliases }) =>
    [id, ...aliases].map((word) => [word, id] as const),
  ),
);

export default function computeEmotionPoints(
  moods: readonly Mood[],
): EmotionPoint[] {
  return computeEmotionData(moods).points;
}

export function computeEmotionData(moods: readonly Mood[]) {
  const counts = new Map<string, number>();
  let matchedEntryCount = 0;

  for (const { description, exploration } of moods) {
    const matchedIds = new Set<string>();
    for (const text of [description, exploration]) {
      if (!text) continue;
      const words = text
        .normalize("NFKC")
        .toLowerCase()
        .match(/[\p{L}\p{M}\p{N}_]+(?:['’][\p{L}\p{M}\p{N}_]+)*/gu);
      for (const word of words ?? []) {
        const id = emotionIdsByWord.get(word);
        if (id) matchedIds.add(id);
      }
    }
    if (matchedIds.size) matchedEntryCount++;
    for (const id of matchedIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  const points = emotions.flatMap(({ id, label, valence, arousal }) => {
    const count = counts.get(id);
    return count ? [{ id, label, valence, arousal, count }] : [];
  });

  return { points, matchedEntryCount };
}
