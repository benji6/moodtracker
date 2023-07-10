import formatDuration from "date-fns/formatDuration";
import intervalToDuration from "date-fns/intervalToDuration";

export default function formatDurationFromSeconds(seconds: number): string {
  const epoch = new Date(0);
  const secondsAfterEpoch = new Date(seconds * 1000);
  const durationString = formatDuration(
    intervalToDuration({ start: epoch, end: secondsAfterEpoch }),
  );
  return durationString || "N/A";
}
