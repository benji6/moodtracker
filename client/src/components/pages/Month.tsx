import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { addMonths, subMonths } from "date-fns";
import { Chart, Paper } from "eri";
import * as React from "react";
import * as regression from "regression";
import { MOOD_RANGE } from "../../constants";
import { monthFormatter, moodFormatter } from "../../formatters";
import {
  computeAverageMoodInInterval,
  formatIsoMonth,
  moodToColor,
} from "../../utils";
import { StateContext } from "../AppState";
import AddFirstMoodCta from "../shared/AddFirstMoodCta";

const formatter = Intl.DateTimeFormat(undefined, {
  month: "short",
});

const isoMonthRegex = /^(\d){4}-(\d){2}$/;

export default function Month({
  month: monthStr,
}: RouteComponentProps<{ month: string }>) {
  if (!monthStr || !isoMonthRegex.test(monthStr)) return <Redirect to="/404" />;

  const state = React.useContext(StateContext);

  if (!state.moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(state.moods.allIds[0]);
  const finalMoodDate = new Date(
    state.moods.allIds[state.moods.allIds.length - 1]
  );

  const month = new Date(monthStr);
  const nextMonth = addMonths(month, 1);

  const moodIdsInMonth: typeof state.moods.allIds = [];
  for (const id of state.moods.allIds) {
    const date = new Date(id);
    if (date < month) continue;
    if (date > nextMonth) break;
    moodIdsInMonth.push(id);
  }

  const moodValues = moodIdsInMonth.map((id) => state.moods.byId[id].mood);

  const moodCounter = new Map(
    [...Array(MOOD_RANGE[1] - MOOD_RANGE[0] + 1).keys()].map((n) => [
      MOOD_RANGE[0] + n,
      0,
    ])
  );

  for (const moodValue of moodValues) {
    // handle old data stored in decimal format
    const rounded = Math.round(moodValue);
    moodCounter.set(rounded, moodCounter.get(rounded)! + 1);
  }

  const data: [number, number][] = moodIdsInMonth.map((id) => {
    const mood = state.moods.byId[id];
    return [new Date(id).getTime(), mood.mood];
  });

  const monthTime = month.getTime();
  const nextMonthTime = nextMonth.getTime();

  const domain: [number, number] = [monthTime, nextMonthTime];

  const regressionResult = regression.polynomial(
    data.map(([x, y]) => [
      (x - domain[0]) / (domain[1] - domain[0]),
      (y - MOOD_RANGE[0]) / (MOOD_RANGE[1] - MOOD_RANGE[0]),
    ]),
    { order: 6, precision: 3 }
  );

  return (
    <Paper.Group>
      <Paper>
        <h2>{monthFormatter.format(month)}</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {month > firstMoodDate ? (
            <Link to={`../${formatIsoMonth(subMonths(month, 1))}`}>
              Previous month
            </Link>
          ) : (
            <span />
          )}
          {nextMonth <= finalMoodDate && (
            <Link to={`../${formatIsoMonth(nextMonth)}`}>Next month</Link>
          )}
        </div>
      </Paper>
      {moodIdsInMonth.length ? (
        <>
          <Paper>
            <Chart
              aria-label="Chart displaying mood entries against time"
              colorFromY={moodToColor}
              data={data}
              domain={domain}
              range={MOOD_RANGE}
              trendlinePoints={regressionResult.points.map(([x, y]) => [
                x * (domain[1] - domain[0]) + domain[0],
                y * (MOOD_RANGE[1] - MOOD_RANGE[0]) + MOOD_RANGE[0],
              ])}
              xAxisLabel="Date"
              xLabels={[
                [monthTime, formatter.format(month)],
                [nextMonthTime, formatter.format(nextMonth)],
              ]}
              yAxisLabel="Mood"
              yLabels={[...Array(MOOD_RANGE[1] + 1).keys()].map((y) => [
                y,
                String(y),
              ])}
            />
          </Paper>
          <Paper>
            <h3>Overview</h3>
            <table>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Average mood</td>
                  <td>
                    {moodFormatter.format(
                      computeAverageMoodInInterval(
                        state.moods,
                        month,
                        nextMonth
                      )
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Best mood</td>
                  <td>{Math.max(...moodValues)}</td>
                </tr>
                <tr>
                  <td>Worst mood</td>
                  <td>{Math.min(...moodValues)}</td>
                </tr>
                <tr>
                  <td>Total moods recorded</td>
                  <td>{moodValues.length}</td>
                </tr>
              </tbody>
            </table>
          </Paper>
          <Paper>
            <h3>Mood frequency</h3>
            <table>
              <thead>
                <tr>
                  <th>Mood</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {[...moodCounter.entries()].map(([mood, count]) => (
                  <tr key={mood}>
                    <td>{mood}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </>
      ) : (
        <Paper>
          <p>No data for this month.</p>
        </Paper>
      )}
    </Paper.Group>
  );
}
