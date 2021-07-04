import differenceInHours from "date-fns/differenceInHours";
import { Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { twoDecimalPlacesFormatter } from "../../../numberFormatters";
import {
  normalizedMeditationsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import { computeMean } from "../../../utils";

const HOURS = 4;

export default function MeditationStats() {
  const meditations = useSelector(normalizedMeditationsSelector);
  const moods = useSelector(normalizedMoodsSelector);

  if (!meditations.allIds.length) return null;

  const moodChanges: number[] = [];
  let i = 0;
  for (const meditationId of meditations.allIds) {
    for (; i < moods.allIds.length; i++) {
      const moodAfterId = moods.allIds[i];
      if (moodAfterId < meditationId || i === 0) continue;
      const moodBeforeId = moods.allIds[i - 1];
      const moodBefore = moods.byId[moodBeforeId];
      const moodAfter = moods.byId[moodAfterId];
      const meditationDate = new Date(meditationId);
      const differenceBefore = differenceInHours(
        meditationDate,
        new Date(moodBeforeId)
      );
      const differenceAfter = differenceInHours(
        new Date(moodAfterId),
        meditationDate
      );

      if (differenceBefore > HOURS || differenceAfter > HOURS) break;

      moodChanges.push(moodAfter.mood - moodBefore.mood);
      break;
    }
  }

  const averageMoodChangeAfterMeditation = computeMean(moodChanges);

  if (averageMoodChangeAfterMeditation === undefined) return null;

  return (
    <Paper>
      <h3>Stats</h3>
      <p>
        {Math.abs(Math.round(averageMoodChangeAfterMeditation * 100)) === 0 ? (
          "On average there is not a big difference between the moods you record before meditation and the ones you record after meditation"
        ) : (
          <>
            On average the mood you record after meditation is{" "}
            <b>
              {twoDecimalPlacesFormatter.format(
                Math.abs(averageMoodChangeAfterMeditation)
              )}{" "}
              {averageMoodChangeAfterMeditation > 0 ? "higher" : "lower"}
            </b>{" "}
            than the mood you record before. This calculation only takes into
            account the impact when you record a mood up to {HOURS} hours before
            meditation and up to {HOURS} hours after.
          </>
        )}
      </p>
    </Paper>
  );
}
