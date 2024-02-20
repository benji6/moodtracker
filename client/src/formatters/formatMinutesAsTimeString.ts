import { TIME } from "../constants";

export const formatMinutesAsTimeStringShort = (minutes: number): string =>
  [
    Math.floor(minutes / TIME.minutesPerHour),
    Math.round(minutes % TIME.minutesPerHour),
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");

export const formatMinutesAsTimeStringLong = (minutes: number): string => {
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
[].map((n) => String(n).padStart(2, "0")).join(":");
