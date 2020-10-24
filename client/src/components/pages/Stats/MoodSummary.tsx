import { Paper } from "eri";
import * as React from "react";
import {
  computeAverageMoodInInterval,
  getMoodIdsInInterval,
} from "../../../utils";
import { StateContext } from "../../AppState";
import MoodCell from "./MoodCell";

interface Props {
  dates: [Date, Date, Date, Date];
  periodName: "month" | "week";
}

const BestMoodCell = ({ moodValues }: { moodValues: number[] }) =>
  moodValues.length ? (
    <MoodCell mood={Math.max(...moodValues)} />
  ) : (
    <td className="center">N/A</td>
  );

const WorstMoodCell = ({ moodValues }: { moodValues: number[] }) =>
  moodValues.length ? (
    <MoodCell mood={Math.min(...moodValues)} />
  ) : (
    <td className="center">N/A</td>
  );

export default function MoodSummary({ dates, periodName }: Props) {
  const state = React.useContext(StateContext);
  const [date0, date1, date2, date3] = dates;
  const firstMoodDate = new Date(state.moods.allIds[0]);
  const finalMoodDate = new Date(
    state.moods.allIds[state.moods.allIds.length - 1]
  );
  const showPrevious = date1 > firstMoodDate;
  const showNext = date2 <= finalMoodDate;
  const moodValues = getMoodIdsInInterval(state.moods.allIds, date1, date2).map(
    (id) => state.moods.byId[id].mood
  );
  const prevMoodValues = getMoodIdsInInterval(
    state.moods.allIds,
    date0,
    date1
  ).map((id) => state.moods.byId[id].mood);
  const nextMoodValues = getMoodIdsInInterval(
    state.moods.allIds,
    date2,
    date3
  ).map((id) => state.moods.byId[id].mood);

  return (
    <Paper>
      <h3>Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Stat</th>
            {showPrevious && <th>Last {periodName}</th>}
            <th>This {periodName}</th>
            {showNext && <th>Next {periodName}</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Average mood</td>
            {showPrevious && (
              <MoodCell
                mood={computeAverageMoodInInterval(state.moods, date0, date1)}
              />
            )}
            <MoodCell
              mood={computeAverageMoodInInterval(state.moods, date1, date2)}
            />
            {showNext && (
              <MoodCell
                mood={computeAverageMoodInInterval(state.moods, date2, date3)}
              />
            )}
          </tr>
          <tr>
            <td>Best mood</td>
            {showPrevious && <BestMoodCell moodValues={prevMoodValues} />}
            <BestMoodCell moodValues={moodValues} />
            {showNext && <BestMoodCell moodValues={nextMoodValues} />}
          </tr>
          <tr>
            <td>Worst mood</td>
            {showPrevious && <WorstMoodCell moodValues={prevMoodValues} />}
            <WorstMoodCell moodValues={moodValues} />
            {showNext && <WorstMoodCell moodValues={nextMoodValues} />}
          </tr>
          <tr>
            <td>Total moods recorded</td>
            {showPrevious && <td>{prevMoodValues.length}</td>}
            <td>{moodValues.length}</td>
            {showNext && <td>{nextMoodValues.length}</td>}
          </tr>
        </tbody>
      </table>
    </Paper>
  );
}
