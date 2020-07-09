import { NavigateFn, RouteComponentProps } from "@reach/router";
import { Paper, Fab, Icon, Spinner, RadioButton, Pagination } from "eri";
import * as React from "react";
import { StateContext } from "../../AppState";
import MoodChart from "./MoodChart";
import { FluxStandardAction } from "../../../types";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";

const SECONDS_IN_A_DAY = 86400000;

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

export default function Stats({ navigate }: RouteComponentProps) {
  useRedirectUnauthed();
  const state = React.useContext(StateContext);
  const [localState, localDispatch] = React.useReducer(statsReducer, {
    dayCount: 7,
    page: 0,
  });

  const now = Date.now();

  let pageCount = 1;
  let visibleMoods = state.moods;

  const domain: [number, number] = [
    visibleMoods.allIds.length
      ? new Date(visibleMoods.allIds[0]).getTime()
      : now - SECONDS_IN_A_DAY,
    now,
  ];

  if (localState.dayCount !== undefined) {
    const domainSpread = localState.dayCount * SECONDS_IN_A_DAY;
    domain[1] = now - domainSpread * localState.page;
    domain[0] = domain[1] - domainSpread;

    let allIds: string[] = [];

    for (const id of state.moods.allIds) {
      const moodTime = new Date(id).getTime();
      if (moodTime < now - domainSpread * (localState.page + 1)) continue;
      if (moodTime > domain[1]) break;
      allIds.push(id);
    }

    visibleMoods = { ...state.moods, allIds };

    const oldestMoodId = state.moods.allIds[0];

    if (oldestMoodId) {
      const dt = now - new Date(oldestMoodId).getTime();
      pageCount = Math.ceil(dt / domainSpread);
    }
  }

  return (
    <Paper.Group>
      <>
        {state.events.hasLoadedFromServer ? (
          state.moods.allIds.length ? (
            <>
              <MoodChart domain={domain} moods={visibleMoods} range={[0, 10]} />
              <Paper>
                <h2>Filter</h2>
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
            </>
          ) : (
            <AddFirstMoodCta />
          )
        ) : (
          <Spinner />
        )}
        <Fab
          aria-label="add new mood"
          onClick={() => (navigate as NavigateFn)("add")}
        >
          <Icon name="plus" size="4" />
        </Fab>
      </>
    </Paper.Group>
  );
}
