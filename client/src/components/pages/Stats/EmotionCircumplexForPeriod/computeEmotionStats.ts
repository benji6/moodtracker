import { Mood } from "../../../../types";
import { computeEmotionData } from "./computeEmotionPoints";

export default function computeEmotionStats(moods: readonly Mood[]) {
  const { points, matchedEntryCount } = computeEmotionData(moods);
  const count = points.reduce((sum, point) => sum + point.count, 0);
  const coverage = moods.length ? matchedEntryCount / moods.length : 0;
  if (!count) return { points, matchedEntryCount, coverage };

  const meanValence =
    points.reduce((sum, point) => sum + point.valence * point.count, 0) / count;
  const meanArousal =
    points.reduce((sum, point) => sum + point.arousal * point.count, 0) / count;
  const valenceSpread = Math.sqrt(
    points.reduce(
      (sum, point) => sum + point.count * (point.valence - meanValence) ** 2,
      0,
    ) / count,
  );
  const arousalSpread = Math.sqrt(
    points.reduce(
      (sum, point) => sum + point.count * (point.arousal - meanArousal) ** 2,
      0,
    ) / count,
  );
  const quadrantCounts = {
    "Pleasant, high energy": 0,
    "Pleasant, low energy": 0,
    "Unpleasant, high energy": 0,
    "Unpleasant, low energy": 0,
    "On an axis": 0,
  };
  for (const point of points) {
    if (point.valence === 0 || point.arousal === 0) {
      quadrantCounts["On an axis"] += point.count;
    } else {
      const quadrant =
        `${point.valence > 0 ? "Pleasant" : "Unpleasant"}, ${point.arousal > 0 ? "high" : "low"} energy` as const;
      quadrantCounts[quadrant] += point.count;
    }
  }

  return {
    points,
    matchedEntryCount,
    coverage,
    distribution: {
      meanValence,
      meanArousal,
      valenceSpread,
      arousalSpread,
      quadrants: Object.entries(quadrantCounts).map(([label, total]) => ({
        label,
        proportion: total / count,
      })),
    },
  };
}
