import { formatDuration, intervalToDuration } from "date-fns";

export default function formatDurationFromSeconds(seconds: number): string {
  const epoch = new Date(0);
  const secondsAfterEpoch = new Date(seconds * 1000);
  const durationString = formatDuration(
    intervalToDuration({ start: epoch, end: secondsAfterEpoch }),
  );
  return durationString || "N/A";
}
