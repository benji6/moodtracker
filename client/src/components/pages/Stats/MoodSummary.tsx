import { Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { moodsSelector } from "../../../selectors";
import {
  computeAverageMoodInInterval,
  getMoodIdsInInterval,
} from "../../../utils";
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

export default function MoodSummary({
  dates: [date0, date1, date2, date3],
  periodName,
}: Props) {
  const moods = useSelector(moodsSelector);

  const firstMoodDate = new Date(moods.allIds[0]);
  const finalMoodDate = new Date(moods.allIds[moods.allIds.length - 1]);
  const showPrevious = date1 > firstMoodDate;
  const showNext = date2 <= finalMoodDate;
  const moodValues = getMoodIdsInInterval(moods.allIds, date1, date2).map(
    (id) => moods.byId[id].mood
  );
  const prevMoodValues = getMoodIdsInInterval(moods.allIds, date0, date1).map(
    (id) => moods.byId[id].mood
  );
  const nextMoodValues = getMoodIdsInInterval(moods.allIds, date2, date3).map(
    (id) => moods.byId[id].mood
  );

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
                mood={computeAverageMoodInInterval(moods, date0, date1)}
              />
            )}
            <MoodCell
              mood={computeAverageMoodInInterval(moods, date1, date2)}
            />
            {showNext && (
              <MoodCell
                mood={computeAverageMoodInInterval(moods, date2, date3)}
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
