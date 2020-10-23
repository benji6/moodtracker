import chroma from "chroma-js";
import { set, add } from "date-fns";
import { State } from "./components/AppState";
import { MOOD_RANGE } from "./constants";
import { NormalizedMoods } from "./types";

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

  let area = 0;

  const relevantMoodIds = getEnvelopingMoodIds(moods.allIds, fromDate, toDate);

  for (let j = 1; j < relevantMoodIds.length; j++) {
    const id0 = relevantMoodIds[j - 1];
    const t0 = new Date(id0).getTime();
    const mood0 = moods.byId[id0].mood;

    const id1 = relevantMoodIds[j];
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

const TRENDLINE_POINTS_COUNT = 32;
const TRENDLINE_MOVING_AVERAGE_PERIOD_COUNT = 3;

export const computeTrendlinePoints = (
  moods: NormalizedMoods,
  domain: [number, number]
): [number, number][] => {
  const period = (domain[1] - domain[0]) / TRENDLINE_POINTS_COUNT;
  const earliestMoodTime = new Date(moods.allIds[0]).getTime();
  const latestMoodTime = new Date(
    moods.allIds[moods.allIds.length - 1]
  ).getTime();

  const trendlinePoints: [number, number][] = [];

  for (let i = 0; i < TRENDLINE_POINTS_COUNT + 1; i++) {
    const t0 =
      domain[0] + (i - TRENDLINE_MOVING_AVERAGE_PERIOD_COUNT / 2) * period;
    const t1 = t0 + period * TRENDLINE_MOVING_AVERAGE_PERIOD_COUNT;
    const trendlineX = (t0 + t1) / 2;
    if (trendlineX < earliestMoodTime) continue;
    if (trendlineX > latestMoodTime) break;
    const mood = computeAverageMoodInInterval(
      moods,
      new Date(t0),
      new Date(t1)
    );
    trendlinePoints.push([trendlineX, mood]);
  }

  return trendlinePoints;
};

// hard to name, but will return all moods within
// date range and if they exist will also include
// first mood before range and first mood after range
export const getEnvelopingMoodIds = (
  ids: State["moods"]["allIds"],
  fromDate: Date,
  toDate: Date
): State["moods"]["allIds"] => {
  if (fromDate > toDate) throw Error("`fromDate` should not be after `toDate`");

  const t0 = fromDate.getTime();
  const t1 = toDate.getTime();
  const envelopingMoodIds: State["moods"]["allIds"] = [];

  let i = 0;

  for (; i < ids.length; i++) {
    const moodTime = new Date(ids[i]).getTime();
    if (moodTime >= t0) break;
  }

  if (i > 0) envelopingMoodIds.push(ids[i - 1]);

  for (; i < ids.length; i++) {
    const id = ids[i];
    envelopingMoodIds.push(id);
    if (new Date(id).getTime() > t1) break;
  }

  return envelopingMoodIds;
};

export const getMoodIdsInInterval = (
  ids: State["moods"]["allIds"],
  fromDate: Date,
  toDate: Date
): State["moods"]["allIds"] => {
  if (fromDate > toDate) throw Error("`fromDate` should not be after `toDate`");

  const idsInInterval: typeof ids = [];

  for (const id of ids) {
    const date = new Date(id);
    if (date < fromDate) continue;
    if (date > toDate) break;
    idsInInterval.push(id);
  }

  return idsInInterval;
};

export const formatIsoMonth = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const mapRight = <A, B>(xs: A[], f: (x: A) => B): B[] => {
  let ys = [];
  for (let i = xs.length - 1; i >= 0; i--) ys.push(f(xs[i]));
  return ys;
};

const getColor = chroma
  .scale(["1747f0", "00e0e0", "30ff20"])
  .domain([MOOD_RANGE[0], MOOD_RANGE[1]])
  .mode("lch");

// chroma-js has a cache which is very useful
// to limit memory overhead we round the mood
export const moodToColor = (mood: number): string =>
  getColor(Number(mood.toFixed(1))).hex();

export const roundDateDown = (date: Date): Date =>
  set(date, {
    hours: 0,
    milliseconds: 0,
    minutes: 0,
    seconds: 0,
  });

export const roundDateUp = (date: Date): Date => {
  const roundedDownDate = roundDateDown(date);
  return Number(roundedDownDate) === Number(date)
    ? date
    : add(roundedDownDate, { days: 1 });
};

export const trapeziumArea = (a: number, b: number, h: number): number =>
  ((a + b) / 2) * h;
