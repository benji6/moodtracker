import * as React from "react";
import { FluxStandardAction } from "../../../../types";
import { Paper, RadioButton, Pagination, Spinner } from "eri";
import {
  roundDateUp,
  roundDateDown,
  getEnvelopingMoodIds,
} from "../../../../utils";
import MoodChartForPeriod from "../MoodChartForPeriod";
import {
  appIsStorageLoadingSelector,
  eventsSelector,
  moodsSelector,
} from "../../../../selectors";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "@reach/router";
import AverageMoodByHour from "./AverageMoodByHour";
import useRedirectUnauthed from "../../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../../shared/AddFirstMoodCta";

const MILLISECONDS_IN_A_DAY = 86400000;
const MILLISECONDS_IN_HALF_A_DAY = MILLISECONDS_IN_A_DAY / 2;
const X_LABELS_COUNT = 4; // must be at least 2

const convertDateToLabel = (date: Date): [number, string] => [
  Number(date),
  dateFormatter.format(date),
];

const createXLabels = (
  domain: [number, number],
  now: number
): [number, string][] => {
  const labels: [number, string][] = [];

  labels.push(convertDateToLabel(roundDateUp(new Date(domain[0]))));

  const roundFn =
    now - roundDateDown(new Date(now)).getTime() < MILLISECONDS_IN_HALF_A_DAY
      ? roundDateUp
      : roundDateDown;

  for (let i = 1; i < X_LABELS_COUNT - 1; i++) {
    labels.push(
      convertDateToLabel(
        roundFn(
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

export default function ExploreStats(_: RouteComponentProps) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);
  const [localState, localDispatch] = React.useReducer(statsReducer, {
    dayCount: 7,
    page: 0,
  });
  if (useSelector(appIsStorageLoadingSelector)) return <Spinner />;

  if (!events.hasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  const now = Date.now();

  let pageCount = 1;
  let visibleIds = moods.allIds;

  const domain: [number, number] = [
    visibleIds.length
      ? new Date(visibleIds[0]).getTime()
      : now - MILLISECONDS_IN_A_DAY,
    now,
  ];

  if (localState.dayCount !== undefined) {
    const domainSpread = localState.dayCount * MILLISECONDS_IN_A_DAY;
    domain[1] = now - domainSpread * localState.page;
    domain[0] = domain[1] - domainSpread;

    visibleIds = getEnvelopingMoodIds(
      moods.allIds,
      new Date(domain[0]),
      new Date(domain[1])
    );

    const oldestMoodId = moods.allIds[0];

    if (oldestMoodId) {
      const dt = now - new Date(oldestMoodId).getTime();
      pageCount = Math.ceil(dt / domainSpread);
    }
  }

  return (
    <Paper.Group>
      <Paper>
        <h2>Mood chart</h2>
        <MoodChartForPeriod
          fromDate={new Date(domain[0])}
          hidePoints
          toDate={new Date(domain[1])}
          xLabels={createXLabels(domain, now)}
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
      <AverageMoodByHour />
    </Paper.Group>
  );
}
