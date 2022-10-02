import { Paper } from "eri";
import { useSelector } from "react-redux";
import {
  normalizedMeditationsSelector,
  normalizedMoodsSelector,
  normalizedWeightsSelector,
} from "../../../selectors";
import {
  computeStandardDeviation,
  formatIsoDateInLocalTimezone,
  computeSecondsMeditatedInInterval,
  computeMean,
  getDenormalizedDataInInterval,
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
  const normalizedWeights = useSelector(normalizedWeightsSelector);

  const weightsInPeriod = getDenormalizedDataInInterval(
    normalizedWeights,
    date1,
    date2
  ).map(({ value }) => value);
  const weightsInPreviousPeriod = getDenormalizedDataInInterval(
    normalizedWeights,
    date0,
    date1
  ).map(({ value }) => value);

  const firstMoodDate = new Date(moods.allIds[0]);
  const showPrevious = date1 > firstMoodDate;

  const moodValues = getDenormalizedDataInInterval(moods, date1, date2).map(
    ({ mood }) => mood
  );
  const prevMoodValues = getDenormalizedDataInInterval(moods, date0, date1).map(
    ({ mood }) => mood
  );

  return (
    <Paper>
      <h3>Summary</h3>
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: normalizedAverages.byId[formatIsoDateInLocalTimezone(date1)],
          meanWeight: computeMean(weightsInPeriod),
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
                meanWeight: computeMean(weightsInPreviousPeriod),
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
