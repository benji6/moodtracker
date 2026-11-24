import { describe, expect, it } from "vitest";
import computeEmotionStats from "./computeEmotionStats";

describe("computeEmotionStats", () => {
  it("uses the same entry weights for means and population spread", () => {
    const stats = computeEmotionStats([
      { mood: 5, description: "happy", exploration: "happy happiness" },
      { mood: 5, exploration: "happy excited" },
      { mood: 5, exploration: "A walk in the park" },
    ]);

    expect(stats.matchedEntryCount).toBe(2);
    expect(stats.coverage).toBeCloseTo(2 / 3);
    expect(stats.distribution?.meanValence).toBeCloseTo(0.76);
    expect(stats.distribution?.meanArousal).toBeCloseTo(0.89 / 3);
    expect(stats.distribution?.valenceSpread).toBeCloseTo(0.127279);
    expect(stats.distribution?.arousalSpread).toBeCloseTo(0.249844);
  });

  it("weights all four quadrants and keeps axis matches separate", () => {
    const stats = computeEmotionStats([
      { mood: 5, exploration: "happy calm angry sad surprised neutral" },
      { mood: 5, exploration: "happy" },
    ]);

    expect(stats.coverage).toBe(1);
    expect(stats.distribution?.quadrants).toEqual([
      { label: "Pleasant, high energy", proportion: 2 / 7 },
      { label: "Pleasant, low energy", proportion: 1 / 7 },
      { label: "Unpleasant, high energy", proportion: 1 / 7 },
      { label: "Unpleasant, low energy", proportion: 1 / 7 },
      { label: "On an axis", proportion: 2 / 7 },
    ]);
  });

  it("reports zero means and spread for repeated neutral matches", () => {
    const { distribution } = computeEmotionStats([
      { mood: 5, exploration: "neutral" },
      { mood: 5, exploration: "neutrality" },
    ]);
    expect(distribution).toMatchObject({
      meanValence: 0,
      meanArousal: 0,
      valenceSpread: 0,
      arousalSpread: 0,
    });
  });

  it("has no distribution when there are no matches or no entries", () => {
    for (const moods of [[], [{ mood: 5, exploration: "A walk" }]]) {
      expect(computeEmotionStats(moods)).toEqual({
        points: [],
        matchedEntryCount: 0,
        coverage: 0,
      });
    }
  });
});
