import { describe, expect, it } from "vitest";
import EmotionCircumplexChart from ".";
import { EmotionPoint } from "./types";
import { renderToStaticMarkup } from "react-dom/server";

const points: EmotionPoint[] = [
  {
    id: "excited",
    label: "Excited",
    valence: 0.6,
    arousal: 0.6,
    count: 4,
  },
  {
    id: "sad",
    label: "Sad",
    valence: -0.6,
    arousal: -0.6,
    count: 1,
  },
];
const quadrants = [
  { label: "Pleasant, high energy", proportion: 0.8 },
  { label: "Pleasant, low energy", proportion: 0 },
  { label: "Unpleasant, high energy", proportion: 0 },
  { label: "Unpleasant, low energy", proportion: 0.2 },
  { label: "On an axis", proportion: 0 },
];

describe("EmotionCircumplexChart", () => {
  it("labels dots with emotion names instead of numbers", () => {
    const markup = renderToStaticMarkup(
      <EmotionCircumplexChart points={points} quadrants={quadrants} />,
    );
    const labels = Array.from(
      markup.matchAll(
        /<text class="m-emotion-circumplex__emotion-label"[^>]*>([^<]+)<\/text>/g,
      ),
      ([, label]) => label,
    );
    expect(labels).toEqual(["Excited", "Sad"]);
    expect(markup).not.toContain("Numbered emotions");
    expect(markup).not.toContain("<ul");
    expect(markup).not.toContain("listed below");
  });

  it("provides accessible naming and exact counts in dot titles", () => {
    const markup = renderToStaticMarkup(
      <EmotionCircumplexChart points={points} quadrants={quadrants} />,
    );
    expect(markup).toContain('role="img"');
    expect(markup).toMatch(/aria-labelledby="([^"]+)-title \1-description"/);
    expect(markup).toContain("Emotion words by valence and arousal");
    expect(markup).toContain("<title>Excited: 4 entries</title>");
    expect(markup).toContain("<title>Sad: 1 entry</title>");
    expect(markup).toContain("scaled within this period");
  });

  it("places positive arousal above negative arousal and scales bubble area", () => {
    const markup = renderToStaticMarkup(
      <EmotionCircumplexChart points={points} quadrants={quadrants} />,
    );
    const circles = Array.from(
      markup.matchAll(
        /<circle class="m-emotion-circumplex__point" cx="([^"]+)" cy="([^"]+)" r="([^"]+)"/g,
      ),
      ([, x, y, radius]) => ({
        x: Number(x),
        y: Number(y),
        radius: Number(radius),
      }),
    );
    expect(circles).toHaveLength(2);
    expect(circles[0].x).toBeGreaterThan(circles[1].x);
    expect(circles[0].y).toBeLessThan(circles[1].y);
    expect(circles[0].radius / circles[1].radius).toBeCloseTo(2);
  });

  it("shades fixed quadrants behind the bubbles and places shares outside the circle", () => {
    const markup = renderToStaticMarkup(
      <EmotionCircumplexChart points={points} quadrants={quadrants} />,
    );
    const sectors = Array.from(
      markup.matchAll(
        /<path class="m-emotion-circumplex__quadrant" d="([^"]+)" fill-opacity="([^"]+)" transform="rotate\((\d+) 240 240\)"/g,
      ),
      ([, path, opacity, rotation]) => ({
        path,
        opacity: Number(opacity),
        rotation: Number(rotation),
      }),
    );
    expect(sectors.map(({ rotation }) => rotation)).toEqual([270, 0, 180, 90]);
    expect(sectors.map(({ opacity }) => opacity)).toEqual([0, 0.2, 0.05, 0]);
    expect(new Set(sectors.map(({ path }) => path)).size).toBe(1);
    expect(
      markup.indexOf('class="m-emotion-circumplex__quadrant"'),
    ).toBeLessThan(markup.indexOf('class="m-emotion-circumplex__point"'));

    const shares = Array.from(
      markup.matchAll(
        /<text class="m-emotion-circumplex__quadrant-share" text-anchor="middle" x="([^"]+)" y="([^"]+)">([^<]+)<\/text>/g,
      ),
      ([, x, y, share]) => ({ x: Number(x), y: Number(y), share }),
    );
    expect(shares.map(({ share }) => share)).toEqual([
      "0.0%",
      "80.0%",
      "20.0%",
      "0.0%",
    ]);
    for (const { x, y } of shares) {
      expect(Math.hypot(x - 240, y - 240)).toBeGreaterThan(200);
    }
    expect(markup).toContain("Pleasant, high energy: 80.0%.");
    expect(markup).toContain("Unpleasant, low energy: 20.0%.");
  });
});
