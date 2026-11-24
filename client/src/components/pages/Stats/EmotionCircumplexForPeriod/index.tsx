import {
  integerFormatter,
  percentFormatter,
  twoDecimalPlacesFormatter,
} from "../../../../formatters/numberFormatters";
import EmotionCircumplexChart from "../../../shared/EmotionCircumplexChart";
import { Paper } from "eri";
import { RootState } from "../../../../store";
import computeEmotionStats from "./computeEmotionStats";
import eventsSlice from "../../../../store/eventsSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
  previousDateFrom?: Date;
}

function formatChange(value: number) {
  if (Math.abs(value) < 0.005) return twoDecimalPlacesFormatter.format(0);
  const formatted = twoDecimalPlacesFormatter.format(Math.abs(value));
  return `${value > 0 ? "+" : "-"}${formatted}`;
}

export default function EmotionCircumplexForPeriod({
  dateFrom,
  dateTo,
  previousDateFrom = new Date(
    dateFrom.getTime() - (dateTo.getTime() - dateFrom.getTime()),
  ),
}: Props) {
  const moods = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, dateFrom, dateTo),
  );
  const previousMoods = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(
      state,
      previousDateFrom,
      new Date(dateFrom.getTime() - 1),
    ),
  );
  const stats = useMemo(() => computeEmotionStats(moods), [moods]);
  const previousStats = useMemo(
    () => computeEmotionStats(previousMoods),
    [previousMoods],
  );
  const { distribution, points } = stats;
  const previousDistribution = previousStats.distribution;

  if (!moods.length) return;

  return (
    <Paper>
      <h3>Emotion circumplex</h3>
      <p>
        Approximate word placements based on{" "}
        <a href="https://doi.org/10.1037/h0077714">
          Russell&apos;s circumplex model of affect (1980)
        </a>
        , not measurements of your emotional state. Matches come from journal
        text and legacy mood tags using a curated English word dictionary, not
        an exhaustive list of emotions. Mixed feelings such as surprise and
        nostalgia can vary in pleasantness and arousal. Matching does not
        interpret context or negation: &quot;not happy&quot; still matches
        &quot;happy&quot;, and words about someone else can match too.
      </p>
      <p>
        <strong>Match coverage</strong>:{" "}
        {percentFormatter.format(stats.coverage)} (
        {integerFormatter.format(stats.matchedEntryCount)} of{" "}
        {integerFormatter.format(moods.length)} entries)
      </p>
      {distribution ? (
        <>
          <p>
            <strong>Mean valence</strong>:{" "}
            {twoDecimalPlacesFormatter.format(distribution.meanValence)}
            <br />
            <strong>Mean arousal</strong>:{" "}
            {twoDecimalPlacesFormatter.format(distribution.meanArousal)}
            <br />
            <strong>Valence spread</strong>:{" "}
            {twoDecimalPlacesFormatter.format(distribution.valenceSpread)}
            <br />
            <strong>Arousal spread</strong>:{" "}
            {twoDecimalPlacesFormatter.format(distribution.arousalSpread)}
          </p>
          {previousDistribution ? (
            <p>
              <strong>Valence change from previous period</strong>:{" "}
              {formatChange(
                distribution.meanValence - previousDistribution.meanValence,
              )}
              <br />
              <strong>Arousal change from previous period</strong>:{" "}
              {formatChange(
                distribution.meanArousal - previousDistribution.meanArousal,
              )}
            </p>
          ) : (
            <p>No emotion matches in the previous period to compare.</p>
          )}
          <p>
            Means, spread, and quadrant balance are weighted by the number of
            entries mentioning each emotion. Each emotion counts once per entry;
            entries with no matches are excluded. Valence ranges from -1
            (unpleasant) to +1 (pleasant), and arousal from -1 (low energy) to
            +1 (high energy). Spread is the population standard deviation:
            higher values indicate more varied emotion words, not necessarily
            changes over time.
          </p>
          <EmotionCircumplexChart
            points={points}
            quadrants={distribution.quadrants}
          />
        </>
      ) : (
        <p>No emotion matches in this period.</p>
      )}
    </Paper>
  );
}
