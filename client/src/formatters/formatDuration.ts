import { formatDuration, intervalToDuration } from "date-fns";
import { TIME } from "../constants";

export const formatMinutesToDurationStringShort = (minutes: number): string => {
  const roundedMinutes = Math.round(minutes);
  return [
    Math.floor(roundedMinutes / TIME.minutesPerHour),
    Math.round(roundedMinutes % TIME.minutesPerHour),
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
};

export const formatMinutesToDurationStringLong = (minutes: number): string => {
  const roundedMinutes = Math.round(minutes);
  if (!roundedMinutes) return "0 minutes";
  const hoursOnly = Math.floor(roundedMinutes / TIME.minutesPerHour);
  const hoursString: string = hoursOnly
    ? `${hoursOnly} hour${hoursOnly === 1 ? "" : "s"}`
    : "";
  const minutesOnly = Math.round(roundedMinutes % TIME.minutesPerHour);
  const minutesString: string = minutesOnly
    ? `${minutesOnly} minute${minutesOnly === 1 ? "" : "s"}`
    : "";
  return [hoursString, minutesString].filter(Boolean).join(" & ");
};

export const formatSecondsToDurationStringLong = (seconds: number): string => {
  const epoch = new Date(0);
  const secondsAfterEpoch = new Date(seconds * 1000);
  const durationString = formatDuration(
    intervalToDuration({ start: epoch, end: secondsAfterEpoch }),
  );
  return durationString || "N/A";
};
const hourFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "hour",
});
const minuteFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "minute",
});
const secondFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "second",
});
export const formatSecondsToOneNumberWithUnits = (seconds: number): string =>
  seconds < TIME.secondsPerMinute
    ? secondFormatter.format(seconds)
    : seconds < TIME.secondsPerHour
      ? minuteFormatter.format(seconds / TIME.secondsPerMinute)
      : hourFormatter.format(seconds / TIME.secondsPerHour);
