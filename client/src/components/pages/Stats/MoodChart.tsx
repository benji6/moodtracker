import { add, set } from "date-fns";
import * as React from "react";
import { FluxStandardAction } from "../../../types";
import { Paper, RadioButton, Pagination } from "eri";
import Chart from "./Chart";
import { StateContext } from "../../AppState";
import { MOOD_RANGE } from "../../../constants";
import { moodToColor } from "../../../utils";

const SECONDS_IN_A_DAY = 86400000;

const roundDateDown = (date: Date): Date =>
  set(date, {
    hours: 0,
    milliseconds: 0,
    minutes: 0,
    seconds: 0,
  });

const roundDateUp = (date: Date): Date => {
  const roundedDownDate = roundDateDown(date);
  return Number(roundedDownDate) === Number(date)
    ? date
    : add(roundedDownDate, { days: 1 });
};

const roundDate = (date: Date): Date => {
  const d0 = roundDateDown(date);
  const d1 = roundDateUp(date);
  const dateTimestamp = Number(date);

  return dateTimestamp - Number(d0) < Number(d1) - dateTimestamp ? d0 : d1;
};

const convertDateToLabel = (date: Date): [number, string] => [
  Number(date),
  dateFormatter.format(date),
];

const X_LABELS_COUNT = 4; // must be at least 2

const createXLabels = (domain: [number, number]): [number, string][] => {
  const labels: [number, string][] = [];

  labels.push(convertDateToLabel(roundDateUp(new Date(domain[0]))));

  for (let i = 1; i < X_LABELS_COUNT - 1; i++) {
    labels.push(
      convertDateToLabel(
        roundDate(
          new Date(
            domain[0] + ((domain[1] - domain[0]) * i) / (X_LABELS_COUNT - 1)
          )
        )
      )
    );
  }

  labels.push(convertDateToLabel(roundDateDown(new Date(domain[1]))));

  return labels;
};

const dateFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
});

type StatsAction =
  | FluxStandardAction<"moods/setDaysToShow", number | undefined>
  | FluxStandardAction<"moods/setPage", number>;

export interface StatsState {
  dayCount: number | undefined;
  page: number;
}

export const statsReducer = (
  state: StatsState,
  action: StatsAction
): StatsState => {
  switch (action.type) {
    case "moods/setDaysToShow": {
      const payload = "payload" in action ? action.payload : undefined;
      return { dayCount: payload, page: 0 };
    }
    case "moods/setPage":
      return { ...state, page: action.payload };
  }
};

export default function MoodChart() {
  const state = React.useContext(StateContext);
  const [localState, localDispatch] = React.useReducer(statsReducer, {
    dayCount: 7,
    page: 0,
  });

  const now = Date.now();

  let pageCount = 1;
  let visibleIds = state.moods.allIds;

  const domain: [number, number] = [
    visibleIds.length
      ? new Date(visibleIds[0]).getTime()
      : now - SECONDS_IN_A_DAY,
    now,
  ];

  if (localState.dayCount !== undefined) {
    const domainSpread = localState.dayCount * SECONDS_IN_A_DAY;
    domain[1] = now - domainSpread * localState.page;
    domain[0] = domain[1] - domainSpread;

    let startIndex = 0;
    let endIndex = visibleIds.length;

    // We are rendering moods off the left and right edge of the chart
    // so the fit line extends to the edge
    for (let i = 0; i < state.moods.allIds.length; i++) {
      const moodTime = new Date(state.moods.allIds[i]).getTime();
      if (
        moodTime < now - domainSpread * (localState.page + 1) ||
        startIndex > 0
      )
        continue;
      if (!startIndex) startIndex = Math.max(i - 1, 0);
      if (moodTime > domain[1]) {
        endIndex = i;
        break;
      }
    }

    visibleIds = state.moods.allIds.slice(startIndex, endIndex);

    const oldestMoodId = state.moods.allIds[0];

    if (oldestMoodId) {
      const dt = now - new Date(oldestMoodId).getTime();
      pageCount = Math.ceil(dt / domainSpread);
    }
  }

  const data: [number, number][] = visibleIds.map((id) => {
    const mood = state.moods.byId[id];
    return [new Date(id).getTime(), mood.mood];
  });

  return (
    <Paper>
      <h2>Mood chart</h2>
      <Chart
        colorFromY={moodToColor}
        data={data}
        domain={domain}
        range={MOOD_RANGE}
        xLabels={createXLabels(domain)}
        yLabels={[...Array(MOOD_RANGE[1] + 1).keys()].map((y) => [
          y,
          String(y),
        ])}
      />
      <RadioButton.Group label="Number of days to show">
        {[
          ...[...Array(4).keys()]
            .map((n) => (n + 1) * 7)
            .map((n) => (
              <RadioButton
                key={n}
                name="day-count"
                onChange={() =>
                  localDispatch({
                    payload: n,
                    type: "moods/setDaysToShow",
                  })
                }
                checked={localState.dayCount === n}
                value={n}
              >
                {n}
              </RadioButton>
            )),
          <RadioButton
            key="all"
            name="day-count"
            onChange={() =>
              localDispatch({
                payload: undefined,
                type: "moods/setDaysToShow",
              })
            }
            checked={localState.dayCount === undefined}
            value={undefined}
          >
            All
          </RadioButton>,
        ]}
      </RadioButton.Group>
      {pageCount > 1 && (
        <>
          <h3>Page</h3>
          <Pagination
            onChange={(n) =>
              localDispatch({ payload: n, type: "moods/setPage" })
            }
            page={localState.page}
            pageCount={pageCount}
          />
        </>
      )}
    </Paper>
  );
}
