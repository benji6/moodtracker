import { MOOD_RANGE } from "./constants";
import { NormalizedMoods } from "./types";

let colorCache = new Map();

export const computeAverageMoodInInterval = (
  moods: NormalizedMoods,
  fromDate: Date,
  toDate: Date
): number => {
  if (!moods.allIds.length) throw Error("No moods");

  const earliestMoodTime = new Date(moods.allIds[0]).getTime();
  const latestMoodTime = new Date(
    moods.allIds[moods.allIds.length - 1]
  ).getTime();

  const d0 = fromDate.getTime();
  const d1 = toDate.getTime();

  if (d1 < d0) throw Error("fromDate must be equal to or before toDate");
  if (d0 > latestMoodTime || d1 < earliestMoodTime)
    throw Error("No moods intersect with provided interval");

  if (moods.allIds.length === 1) return moods.byId[moods.allIds[0]].mood;
  if (d1 === earliestMoodTime) return moods.byId[toDate.toISOString()].mood;
  if (d0 === latestMoodTime) return moods.byId[fromDate.toISOString()].mood;

  const maxArea =
    (Math.min(d1, latestMoodTime) - Math.max(d0, earliestMoodTime)) *
    (MOOD_RANGE[1] - MOOD_RANGE[0]);

  let startIndex = 0;
  for (let j = 1; j < moods.allIds.length; j++) {
    if (new Date(moods.allIds[j]).getTime() > d0) {
      startIndex = j - 1;
      break;
    }
  }

  let endIndex = moods.allIds.length - 1;
  for (let j = startIndex; j < moods.allIds.length - 1; j++) {
    if (new Date(moods.allIds[j]).getTime() >= d1) {
      endIndex = j;
      break;
    }
  }

  let area = 0;

  for (let j = startIndex + 1; j <= endIndex; j++) {
    const id0 = moods.allIds[j - 1];
    const t0 = new Date(id0).getTime();
    const mood0 = moods.byId[id0].mood;

    const id1 = moods.allIds[j];
    const t1 = new Date(id1).getTime();
    const mood1 = moods.byId[id1].mood;

    if (t0 < d0 && t1 > d1) {
      area += trapeziumArea(
        mood0 + ((mood1 - mood0) * (d0 - t0)) / (t1 - t0),
        mood0 + ((mood1 - mood0) * (d1 - t0)) / (t1 - t0),
        d1 - d0
      );
      continue;
    }

    if (t0 < d0) {
      area += trapeziumArea(
        mood1 + ((mood0 - mood1) * (t1 - d0)) / (t1 - t0),
        mood1,
        t1 - d0
      );
      continue;
    }

    if (t1 > d1) {
      area += trapeziumArea(
        mood0,
        mood0 + ((mood1 - mood0) * (d1 - t0)) / (t1 - t0),
        d1 - t0
      );
      break;
    }

    area += trapeziumArea(mood0, mood1, t1 - t0);
  }

  return (area / maxArea) * (MOOD_RANGE[1] - MOOD_RANGE[0]);
};

export const mapRight = <A, B>(xs: A[], f: (x: A) => B): B[] => {
  let ys = [];
  for (let i = xs.length - 1; i >= 0; i--) ys.push(f(xs[i]));
  return ys;
};

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
