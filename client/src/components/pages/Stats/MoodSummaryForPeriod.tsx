import { Paper } from "eri";
import { useSelector } from "react-redux";
import {
  normalizedMeditationsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import {
  computeStandardDeviation,
  formatIsoDateInLocalTimezone,
  getIdsInInterval,
  computeSecondsMeditatedInInterval,
} from "../../../utils";
import MoodSummary from "../../shared/MoodSummary";

interface Props {
  dates: [Date, Date, Date];
  normalizedAverages: {
    allIds: string[];
    byId: {
      [k: string]: number | undefined;
    };
  };
  periodType: "day" | "month" | "week" | "year";
}

export default function MoodSummaryForPeriod({
  dates: [date0, date1, date2],
  normalizedAverages,
  periodType,
}: Props) {
  const meditations = useSelector(normalizedMeditationsSelector);
  const moods = useSelector(normalizedMoodsSelector);

  const firstMoodDate = new Date(moods.allIds[0]);
  const showPrevious = date1 > firstMoodDate;

  const moodValues = getIdsInInterval(moods.allIds, date1, date2).map(
    (id) => moods.byId[id].mood
  );
  const prevMoodValues = getIdsInInterval(moods.allIds, date0, date1).map(
    (id) => moods.byId[id].mood
  );

  return (
    <Paper>
      <h3>Summary</h3>
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: normalizedAverages.byId[formatIsoDateInLocalTimezone(date1)],
          secondsMeditated: computeSecondsMeditatedInInterval(
            meditations,
            date1,
            date2
          ),
          standardDeviation: computeStandardDeviation(moodValues),
          total: moodValues.length,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
        periodType={periodType}
        previousPeriod={
          showPrevious
            ? {
                best: prevMoodValues.length
                  ? Math.max(...prevMoodValues)
                  : undefined,
                mean: normalizedAverages.byId[
                  formatIsoDateInLocalTimezone(date0)
                ],
                secondsMeditated: computeSecondsMeditatedInInterval(
                  meditations,
                  date0,
                  date1
                ),
                standardDeviation: computeStandardDeviation(prevMoodValues),
                total: prevMoodValues.length,
                worst: prevMoodValues.length
                  ? Math.min(...prevMoodValues)
                  : undefined,
              }
            : undefined
        }
      />
    </Paper>
  );
}
