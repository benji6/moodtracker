import {
  computeStandardDeviation,
  formatIsoDateInLocalTimezone,
} from "../../../utils";
import MoodSummary from "../../shared/MoodSummary";
import { Paper } from "eri";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

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

export default function MoodSummaryForCalendarPeriod({
  dates: [date0, date1, date2],
  normalizedAverages,
  periodType,
}: Props) {
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
  const meanWeightInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meanWeightInPeriod(state, date1, date2),
  );
  const meanWeightInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meanWeightInPeriod(state, date0, date1),
  );
  const secondsMeditatedInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.secondsMeditatedInPeriod(state, date1, date2),
  );
  const secondsMeditatedInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.secondsMeditatedInPeriod(state, date0, date1),
  );

  const firstMoodDate = new Date(moods.allIds[0]);
  const showPrevious = date1 > firstMoodDate;

  const moodValues = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, date1, date2),
  ).map(({ mood }) => mood);
  const prevMoodValues = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, date0, date1),
  ).map(({ mood }) => mood);

  return (
    <Paper>
      <h3>Summary</h3>
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: normalizedAverages.byId[formatIsoDateInLocalTimezone(date1)],
          meanWeight: meanWeightInPeriod,
          secondsMeditated: secondsMeditatedInCurrentPeriod,
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
                meanWeight: meanWeightInPreviousPeriod,
                secondsMeditated: secondsMeditatedInPreviousPeriod,
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
