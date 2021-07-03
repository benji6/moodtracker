import { Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { twoDecimalPlacesFormatter } from "../../../numberFormatters";
import {
  normalizedMeditationsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import { computeMean } from "../../../utils";

export default function MeditationStats() {
  const meditations = useSelector(normalizedMeditationsSelector);
  const moods = useSelector(normalizedMoodsSelector);

  if (!meditations.allIds.length) return null;

  const moodChanges: number[] = [];
  let i = 0;
  for (const meditationId of meditations.allIds) {
    for (; i < moods.allIds.length; i++) {
      const moodId = moods.allIds[i];
      if (moodId < meditationId || i === 0) continue;
      const moodBefore = moods.byId[moods.allIds[i - 1]];
      const moodAfter = moods.byId[moodId];
      moodChanges.push(moodAfter.mood - moodBefore.mood);
      break;
    }
  }

  // Component does not render unless there are meditations
  const averageMoodChangeAfterMeditation = computeMean(moodChanges)!;

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
            after meditation than the mood you record before.
          </>
        )}
      </p>
    </Paper>
  );
}
