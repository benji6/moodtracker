import { MOOD_EXTENT, TIME } from "./constants";
import { addDays, getDay, set } from "date-fns";
import { ComponentProps } from "react";
import { Icon } from "eri";
import { NormalizedMoods } from "./types";
import { captureException } from "./sentry";
import { interpolateHcl } from "d3-interpolate";
import { removeStopwords } from "stopword";

const BESPOKE_STOP_WORDS = new Set([
  "-",
  "Ain't",
  "Aren't",
  "Around",
  "Bit",
  "Couldn't",
  "Day's",
  "Day",
  "Days",
  "Didn't",
  "Does",
  "Doesn't",
  "Doing",
  "Don't",
  "Else's",
  "Etc",
  "Even",
  "Find",
  "Go",
  "Going",
  "Gonna",
  "Hadn't",
  "Haven't",
  "He'd",
  "He's",
  "Here's",
  "I'd",
  "I'll",
  "I'm",
  "I've",
  "Isn't",
  "It'll",
  "It's",
  "Just",
  "Let's",
  "Lot",
  "Lots",
  "Next",
  "Night's",
  "Night",
  "No",
  "Not",
  "People's",
  "Peoples'",
  "Really",
  "See",
  "She'll",
  "She's",
  "She",
  "So",
  "Something",
  "That'll",
  "That's",
  "There's",
  "They'll",
  "They're",
  "They've",
  "Thing",
  "Things",
  "Though",
  "Today's",
  "Today",
  "Tomorrow",
  "Wasn't",
  "We'd",
  "We'll",
  "We're",
  "We've",
  "Went",
  "Weren't",
  "What's",
  "When's",
  "Wouldn't",
  "Yesterday",
  "You're",
]);

export const bisectLeft = (xs: string[], x: string, left = 0) => {
  let right = xs.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (xs[mid] < x) left = mid + 1;
    else right = mid;
  }
  return left;
};

export const capitalizeFirstLetter = (s: string): string =>
  s && `${s[0].toUpperCase()}${s.toLowerCase().slice(1)}`;

export const compareFunctionForStringSorting = (
  a: string,
  b: string,
): number => (a > b ? 1 : a < b ? -1 : 0);

export const computeAverageMoodInInterval = (
  moods: NormalizedMoods,
  dateFrom: Date,
  dateTo: Date,
): number | undefined => {
  if (!moods.allIds.length) {
    captureException(Error("No moods"));
    return;
  }

  const earliestMoodTime = new Date(moods.allIds[0]).getTime();
  const latestMoodTime = new Date(
    moods.allIds[moods.allIds.length - 1],
  ).getTime();

  const d0 = dateFrom.getTime();
  const d1 = dateTo.getTime();

  if (d1 < d0) {
    captureException(Error("`dateFrom` must be equal to or before `dateTo`"));
    return;
  }
  if (d0 > latestMoodTime || d1 < earliestMoodTime) return;

  if (moods.allIds.length === 1) return moods.byId[moods.allIds[0]].mood;
  if (d1 === earliestMoodTime) return moods.byId[dateTo.toISOString()].mood;
  if (d0 === latestMoodTime) return moods.byId[dateFrom.toISOString()].mood;

  const maxArea =
    (Math.min(d1, latestMoodTime) - Math.max(d0, earliestMoodTime)) *
    MOOD_EXTENT;

  let area = 0;

  const relevantMoodIds = getEnvelopingIds(moods.allIds, dateFrom, dateTo);

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
        d1 - d0,
      );
      continue;
    }

    if (t0 < d0) {
      area += trapeziumArea(
        mood1 + ((mood0 - mood1) * (t1 - d0)) / (t1 - t0),
        mood1,
        t1 - d0,
      );
      continue;
    }

    if (t1 > d1) {
      area += trapeziumArea(
        mood0,
        mood0 + ((mood1 - mood0) * (d1 - t0)) / (t1 - t0),
        d1 - t0,
      );
      break;
    }

    area += trapeziumArea(mood0, mood1, t1 - t0);
  }

  return (area / maxArea) * MOOD_EXTENT;
};

export const computeMean = (xs: number[]): number => {
  if (!xs.length) throw Error("Need at least one number to compute mean");
  const mean = computeMeanSafe(xs);
  if (mean === undefined) throw Error("mean cannot be undefined");
  return mean;
};

export const computeMeanSafe = (xs: number[]): number | undefined => {
  if (!xs.length) return;
  let sum = 0;
  for (const x of xs) sum += x;
  return sum / xs.length;
};

export const computeCompletePopulationStandardDeviation = (
  xs: number[],
): number | undefined => {
  if (!xs.length) return;
  const mean = computeMean(xs);
  let sumOfSquaredDifferences = 0;
  for (const x of xs) sumOfSquaredDifferences += (x - mean) ** 2;
  // For a sample (rather than the complete population),
  // the denominator would be `(xs.length - 1)`
  return Math.sqrt(sumOfSquaredDifferences / xs.length);
};

export const convertKelvinToCelcius = (kelvin: number): number =>
  kelvin - 273.15;

export const counter = (xs: string[]): Record<string, number> => {
  const count = defaultDict(Number);
  for (const x of xs) count[x] += 1;
  return { ...count };
};

export const createChartExtent = (values: number[]): [number, number] => {
  const { length } = values;
  if (length < 2)
    throw Error(
      `\`createChartExtent\` requires at least 2 values but received ${length}`,
    );

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const adjustment = (10 - ((maxValue - minValue) % 10)) / 2;
  return [Math.round(minValue - adjustment), Math.round(maxValue + adjustment)];
};

export const createDateFromLocalDateString = (dateString: string) =>
  new Date(`${dateString}T00:00:00`);

export const defaultDict = <V>(createDefaultValue: () => V) =>
  new Proxy<Record<string, V>>(Object.create(null), {
    get: (target, key: string): V => {
      if (!Object.hasOwn(target, key)) target[key] = createDefaultValue();
      return target[key];
    },
  });

export const getNormalizedWordCloudWords = (string: string): string[] => {
  const words: string[] = [];
  for (const word of removeStopwords(
    string.replace(/[!"(),./:;?[\]{|}]/g, "").split(/\s+/),
  )) {
    if (!word || word.match(/^[0-9&]+$/)) continue;
    const capitalizedWord = capitalizeFirstLetter(word);
    if (BESPOKE_STOP_WORDS.has(capitalizedWord)) continue;
    words.push(capitalizedWord);
  }
  return words;
};

// Hard to name, but will return all moods within
// date range and if they exist will also include
// first mood before range and first mood after range
export const getEnvelopingIds = (
  ids: NormalizedMoods["allIds"],
  dateFrom: Date,
  dateTo: Date,
): NormalizedMoods["allIds"] => {
  if (dateFrom > dateTo) throw Error("`dateFrom` should not be after `dateTo`");

  // We use these ISO-8601 strings to do string comparison of dates.
  // This is a very hot code path and testing indicates that this
  // comparison method is significantly faster than converting
  // and comparing in date object format or in number format.
  // A limitation is that the format of all IDs must be derived
  // from `toISOString` otherwise this may not function as expected.
  const fromIso = dateFrom.toISOString();
  const toIso = dateTo.toISOString();

  const envelopingIds = [];
  let i = Math.max(bisectLeft(ids, fromIso) - 1, 0);
  while (i < ids.length && ids[i] <= toIso) envelopingIds.push(ids[i++]);
  if (i < ids.length) envelopingIds.push(ids[i]);
  return envelopingIds;
};

export const getIdsInInterval = (
  ids: string[],
  dateFrom: Date,
  dateTo: Date,
): typeof ids => {
  if (dateFrom > dateTo) throw Error("`dateFrom` should not be after `dateTo`");
  const idsInInterval: typeof ids = [];
  const fromIso = dateFrom.toISOString();
  const toIso = dateTo.toISOString();
  let i = bisectLeft(ids, fromIso);
  while (i < ids.length && ids[i] <= toIso) idsInInterval.push(ids[i++]);
  return idsInInterval;
};

export const hasIdsInInterval = (
  ids: string[],
  dateFrom: Date,
  dateTo: Date,
): boolean => {
  if (dateFrom > dateTo) throw Error("`dateFrom` should not be after `dateTo`");
  const fromIso = dateFrom.toISOString();
  const toIso = dateTo.toISOString();
  const i = bisectLeft(ids, fromIso);
  return toIso >= ids[i];
};

export const getWeatherDisplayData = ({
  isDaytime,
  weatherId,
}: {
  isDaytime: boolean;
  weatherId: number;
}): {
  iconName: ComponentProps<typeof Icon>["name"];
  label: string;
  weatherColor: string;
} => {
  let iconName: ComponentProps<typeof Icon>["name"] = "cloud";
  let label = "Clouds";
  let weatherColor = "var(--color-balance)";

  if (weatherId) {
    if (weatherId < 300) {
      iconName = "lightning";
      label = "Thunderstorm";
      weatherColor = "var(--color-figure-more)";
    } else if (weatherId < 400) {
      iconName = "drizzle";
      label = "Drizzle";
      weatherColor = "steelblue";
    } else if (weatherId < 600) {
      iconName = "rain";
      label = "Rain";
      weatherColor = "#30f";
    } else if (weatherId < 700) {
      iconName = "snow";
      label = "Snow";
    } else if (weatherId === 771) {
      iconName = "wind";
      label = "Squall";
      weatherColor = "var(--color-figure-more)";
    } else if (weatherId === 781) {
      iconName = "wind";
      label = "Tornado";
      weatherColor = "var(--color-figure-more)";
    } else if (weatherId < 800) {
      label = "Fog/Haze/Dust";
      iconName = "fog";
    } else if (weatherId < 802) {
      if (isDaytime) {
        iconName = "sun";
        weatherColor = "orange";
      } else {
        iconName = "moon";
        weatherColor = "rebeccapurple";
      }
      label = "Clear";
    } else if (weatherId < 803) {
      if (isDaytime) {
        iconName = "partly-cloudy-day";
        weatherColor = "orange";
      } else {
        iconName = "partly-cloudy-night";
        weatherColor = "rebeccapurple";
      }
      label = "Partly cloudy";
    }
  }
  return { iconName, label, weatherColor };
};

export const formatIsoDateInLocalTimezone = (date: Date): string =>
  `${formatIsoMonthInLocalTimezone(date)}-${String(date.getDate()).padStart(
    2,
    "0",
  )}`;

export const formatIsoDateHourInLocalTimezone = (date: Date): string =>
  `${formatIsoDateInLocalTimezone(date)}T${String(date.getHours()).padStart(
    2,
    "0",
  )}:00:00.000Z`;

export const formatIsoMonthInLocalTimezone = (date: Date): string =>
  `${formatIsoYearInLocalTimezone(date)}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;

export const formatIsoYearInLocalTimezone = (date: Date): string =>
  String(date.getFullYear());

export const getWeekdayIndex = (date: Date): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
  const dateFnsWeekdayIndex = getDay(date);
  return ((dateFnsWeekdayIndex ? dateFnsWeekdayIndex : TIME.daysPerWeek) -
    1) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

export const mapRight = <A, B>(xs: A[], f: (x: A) => B): B[] => {
  const ys = [];
  for (let i = xs.length - 1; i >= 0; i--) ys.push(f(xs[i]));
  return ys;
};

const getColorNegative = interpolateHcl("#1747f0", "#00e0e0");
const getColorPositive = interpolateHcl("#00e0e0", "#10ff00");
const getColor = (n: number) =>
  n < 0.5 ? getColorNegative(n * 2) : getColorPositive((n - 0.5) * 2);

const colorCache = new Map<string, string>();
export const moodToColor = (mood: number): string => {
  const roundedMood = mood.toFixed(1);
  const cachedColor = colorCache.get(roundedMood);
  if (cachedColor) return cachedColor;
  const color = getColor(Number(roundedMood) / 10);
  colorCache.set(roundedMood, color);
  return color;
};

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
    : addDays(roundedDownDate, 1);
};

export const roundDownToNearest10 = (n: number) => Math.floor(n / 10) * 10;
export const roundUpToNearest10 = (n: number) => Math.ceil(n / 10) * 10;

export const trapeziumArea = (a: number, b: number, h: number): number =>
  ((a + b) / 2) * h;
