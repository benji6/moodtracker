import { TIME } from "../constants";

export const formatMinutesAsTime = (minutes: number): string => {
  const roundedMinutes = Math.round(minutes);
  return [
    Math.floor(roundedMinutes / TIME.minutesPerHour),
    Math.round(roundedMinutes % TIME.minutesPerHour),
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
};

const hourFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "hour",
});
const hourFormatterLong = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "hour",
  unitDisplay: "long",
});
const minuteFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "minute",
});
const minuteFormatterLong = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "minute",
  unitDisplay: "long",
});
const secondFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "second",
});
const secondFormatterLong = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "second",
  unitDisplay: "long",
});

export const formatMinutesToDurationStringLong = (minutes: number): string => {
  const roundedMinutes = Math.round(minutes);
  if (!roundedMinutes) return minuteFormatterLong.format(roundedMinutes);
  const minutesComponent = Math.round(roundedMinutes % TIME.minutesPerHour);
  const hoursComponent = Math.floor(roundedMinutes / TIME.minutesPerHour);
  return [
    hoursComponent && hourFormatterLong.format(hoursComponent),
    minutesComponent && minuteFormatterLong.format(minutesComponent),
  ]
    .filter(Boolean)
    .join(" & ");
};

export const formatSecondsAsTime = (seconds: number): string =>
  `${String(Math.floor(seconds / TIME.secondsPerMinute)).padStart(
    2,
    "0",
  )}:${String(Math.floor(seconds % TIME.secondsPerMinute)).padStart(2, "0")}`;

export const formatSecondsToDurationStringLong = (seconds: number): string => {
  const roundedSeconds = Math.round(seconds);
  if (!roundedSeconds) return secondFormatterLong.format(roundedSeconds);

  const secondsComponent = Math.round(roundedSeconds % TIME.secondsPerMinute);
  const minutesComponent = Math.floor(
    (roundedSeconds % TIME.secondsPerHour) / TIME.secondsPerMinute,
  );
  const hoursComponent = Math.floor(roundedSeconds / TIME.secondsPerHour);
  const components = [
    hoursComponent && hourFormatterLong.format(hoursComponent),
    minutesComponent && minuteFormatterLong.format(minutesComponent),
    secondsComponent && secondFormatterLong.format(secondsComponent),
  ].filter(Boolean);

  if (components.length === 3)
    return `${components[0]}, ${components[1]} & ${components[2]}`;
  return components.join(" & ");
};

export const formatSecondsToOneNumberWithUnits = (seconds: number): string =>
  seconds < TIME.secondsPerMinute
    ? secondFormatter.format(seconds)
    : seconds < TIME.secondsPerHour
      ? minuteFormatter.format(seconds / TIME.secondsPerMinute)
      : hourFormatter.format(seconds / TIME.secondsPerHour);
