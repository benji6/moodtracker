import { describe, expect, it } from "vitest";
import computeEmotionPoints from "./computeEmotionPoints";
import { emotions } from "./emotions";

const countsFor = (text: string) =>
  computeEmotionPoints([{ mood: 5, exploration: text }]).map(
    ({ id, count }) => ({ id, count }),
  );

describe("computeEmotionPoints", () => {
  it("normalizes case, punctuation, and Unicode compatibility characters", () => {
    expect(countsFor("HAPPY! (sad), ＣＡＬＭ.")).toEqual([
      { id: "happy", count: 1 },
      { id: "sad", count: 1 },
      { id: "calm", count: 1 },
    ]);
  });

  it("only matches whole words and explicit aliases", () => {
    expect(
      countsFor(
        "happyish sadlyish sadness anger happiness " +
          "happy's happy’s sad's sad’s",
      ),
    ).toEqual([
      { id: "happy", count: 1 },
      { id: "angry", count: 1 },
      { id: "sad", count: 1 },
    ]);
    expect(
      countsFor("happyish sadlyish happy's sad’s happy123 123sad happy_sad"),
    ).toEqual([]);
  });

  it.each(emotions)(
    "matches every supported form of $label without alias collisions",
    ({ id, aliases }) => {
      for (const word of [id, ...aliases]) {
        expect(countsFor(word), word).toEqual([{ id, count: 1 }]);
      }
      expect(countsFor([id, ...aliases].join(", "))).toEqual([
        { id, count: 1 },
      ]);
    },
  );

  it.each([
    {
      text: "ecstasy, curiosity, courage, anticipation, amusement",
      ids: ["ecstatic", "curious", "courageous", "anticipation", "amused"],
    },
    {
      text: "panic, disgust, jealousy, resentment",
      ids: ["panicked", "disgusted", "jealous", "resentful"],
    },
    {
      text: "grief, heartbreak, rejection, despair",
      ids: ["grieving", "heartbroken", "rejected", "despairing"],
    },
    {
      text: "love, affection, belonging, reassurance",
      ids: ["loving", "affectionate", "connected", "reassured"],
    },
    {
      text: "surprise, nostalgia, ambivalence, neutrality",
      ids: ["surprised", "nostalgic", "ambivalent", "neutral"],
    },
    {
      text: "fulfilment, tranquillity, centred",
      ids: ["fulfilled", "tranquil", "centered"],
    },
  ])("recognizes broader emotion families: $text", ({ text, ids }) => {
    expect(countsFor(text).sort((a, b) => a.id.localeCompare(b.id))).toEqual(
      ids
        .map((id) => ({ id, count: 1 }))
        .sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  it("recognizes common grammatical forms and deduplicates them", () => {
    expect(
      countsFor(
        "Happier, happiest, happily; sadly, saddened; angrily; thankful",
      ),
    ).toEqual([
      { id: "happy", count: 1 },
      { id: "angry", count: 1 },
      { id: "sad", count: 1 },
      { id: "grateful", count: 1 },
    ]);
  });

  it("does not mistake negative vocabulary for its positive substrings", () => {
    expect(
      countsFor("unhappy dissatisfied insecure hopeless distrust restless")
        .map(({ id }) => id)
        .sort(),
    ).toEqual([
      "dissatisfied",
      "distrustful",
      "hopeless",
      "insecure",
      "restless",
      "unhappy",
    ]);
  });

  it("counts each emotion once per entry across aliases and both fields", () => {
    expect(
      computeEmotionPoints([
        {
          mood: 8,
          description: "happy happiness",
          exploration: "Happy, happy and excited",
        },
        { mood: 2, exploration: "Happiness!" },
      ]).map(({ id, count }) => ({ id, count })),
    ).toEqual([
      { id: "happy", count: 2 },
      { id: "excited", count: 1 },
    ]);
  });

  it.each([
    {
      text: "joy enthusiasm energised pride hopefulness inspiration",
      ids: [
        "joyful",
        "enthusiastic",
        "energetic",
        "proud",
        "hopeful",
        "inspired",
      ],
      valence: 1,
      arousal: 1,
    },
    {
      text: "nervousness anxiety worries fear stress overwhelmed irritation annoyance",
      ids: [
        "nervous",
        "anxious",
        "worried",
        "afraid",
        "stressed",
        "overwhelmed",
        "irritated",
        "annoyed",
      ],
      valence: -1,
      arousal: 1,
    },
    {
      text: "disappointment loneliness shame guilt exhaustion drained",
      ids: [
        "disappointed",
        "lonely",
        "ashamed",
        "guilty",
        "exhausted",
        "drained",
      ],
      valence: -1,
      arousal: -1,
    },
    {
      text: "peacefulness gratitude relief serenity",
      ids: ["peaceful", "grateful", "relieved", "serene"],
      valence: 1,
      arousal: -1,
    },
  ])(
    "recognizes added vocabulary in its quadrant: $text",
    ({ text, ids, valence, arousal }) => {
      const points = computeEmotionPoints([{ mood: 5, exploration: text }]);
      expect(points.map(({ id }) => id).sort()).toEqual([...ids].sort());
      for (const point of points) {
        expect(point.count).toBe(1);
        expect(Math.sign(point.valence)).toBe(valence);
        expect(Math.sign(point.arousal)).toBe(arousal);
        expect(Math.hypot(point.valence, point.arousal)).toBeLessThanOrEqual(1);
      }
      expect(
        countsFor(ids.join(" "))
          .map(({ id }) => id)
          .sort(),
      ).toEqual([...ids].sort());
    },
  );

  it("deduplicates new aliases without matching parts of other words", () => {
    expect(
      computeEmotionPoints([
        {
          mood: 5,
          description:
            "Anxious anxiety, grateful gratitude, energized energised",
          exploration: "anxiety grateful energetic",
        },
        { mood: 5, exploration: "anxiety gratitude" },
      ]).map(({ id, count }) => ({ id, count })),
    ).toEqual([
      { id: "energetic", count: 1 },
      { id: "anxious", count: 2 },
      { id: "grateful", count: 2 },
    ]);
    expect(countsFor("joyless unafraid disgraceful stressful")).toEqual([]);
  });

  it("keeps coordinates independent of mood score and frequency", () => {
    const [first] = computeEmotionPoints([{ mood: 0, exploration: "happy" }]);
    const [second] = computeEmotionPoints([
      { mood: 10, description: "happy" },
      { mood: 10, exploration: "happy" },
    ]);
    expect(second).toEqual({ ...first, count: 2 });
  });

  it("ignores missing text and unsupported vocabulary", () => {
    expect(
      computeEmotionPoints([
        { mood: 5 },
        { mood: 8, description: "", exploration: " \n " },
        { mood: 2, exploration: "a walk in the park 🧪" },
      ]),
    ).toEqual([]);
    expect(computeEmotionPoints([])).toEqual([]);
  });

  it("matches words literally without interpreting context or negation", () => {
    expect(countsFor("I am not happy; she was sad.")).toEqual([
      { id: "happy", count: 1 },
      { id: "sad", count: 1 },
    ]);
  });
});
