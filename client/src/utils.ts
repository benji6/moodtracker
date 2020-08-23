import { MOOD_RANGE } from "./constants";

let colorCache = new Map();

export const moodToColor = (mood: number): string => {
  const cachedColor = colorCache.get(mood);
  if (cachedColor) return cachedColor;
  const n = (mood - MOOD_RANGE[0]) / (MOOD_RANGE[1] - MOOD_RANGE[0]);
  const color = `hsl(${0.75 - n * 0.4}turn, 100%, ${65 - 25 * n}%)`;
  colorCache.set(mood, color);
  return color;
};

export const trapeziumArea = (a: number, b: number, h: number): number =>
  ((a + b) / 2) * h;
