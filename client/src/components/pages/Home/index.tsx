import { Link, NavigateFn, RouteComponentProps } from "@reach/router";
import { Paper, Fab, Icon, Spinner, RadioButton, Pagination } from "eri";
import * as React from "react";
import { StateContext } from "../../AppState";
import MoodGraph from "./MoodGraph";
import MoodList from "./MoodList";
import { FluxStandardAction } from "../../../types";

type HomeAction =
  | FluxStandardAction<"moods/setDaysToShow", number | undefined>
  | FluxStandardAction<"moods/setPage", number>;

export interface HomeState {
  dayCount: number | undefined;
  page: number;
}

export const homeReducer = (
  state: HomeState,
  action: HomeAction
): HomeState => {
  switch (action.type) {
    case "moods/setDaysToShow": {
      const payload = "payload" in action ? action.payload : undefined;
      return { dayCount: payload, page: 0 };
    }
    case "moods/setPage":
      return { ...state, page: action.payload };
  }
};

export default function Home({ navigate }: RouteComponentProps) {
  const state = React.useContext(StateContext);
  const [homeState, homeDispatch] = React.useReducer(homeReducer, {
    dayCount: 7,
    page: 0,
  });

  const now = Date.now();

  let visibleMoods = state.moods;

  let pageCount = 1;

  let domain: [number, number] = [
    new Date(visibleMoods.allIds[0]).getTime(),
    now,
  ];

  if (homeState.dayCount !== undefined) {
    const pageSize = homeState.dayCount * 86400000;
    const domainEnd = now - pageSize * homeState.page;

    visibleMoods = {
      ...state.moods,
      allIds: state.moods.allIds.filter((id) => {
        const moodTime = new Date(id).getTime();
        return (
          moodTime > now - pageSize * (homeState.page + 1) &&
          moodTime < domainEnd
        );
      }),
    };

    const oldestMoodId = state.moods.allIds[0];

    if (oldestMoodId) {
      const dt = now - new Date(oldestMoodId).getTime();
      pageCount = Math.ceil(dt / pageSize);
    }

    domain = [new Date(visibleMoods.allIds[0]).getTime(), domainEnd];
  }

  return (
    <Paper.Group>
      {state.userEmail ? (
        <>
          {state.events.hasLoadedFromServer ? (
            state.moods.allIds.length ? (
              <>
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
                              homeDispatch({
                                payload: n,
                                type: "moods/setDaysToShow",
                              })
                            }
                            checked={homeState.dayCount === n}
                            value={n}
                          >
                            {n}
                          </RadioButton>
                        )),
                      <RadioButton
                        key="all"
                        name="day-count"
                        onChange={() =>
                          homeDispatch({
                            payload: undefined,
                            type: "moods/setDaysToShow",
                          })
                        }
                        checked={homeState.dayCount === undefined}
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
                          homeDispatch({ payload: n, type: "moods/setPage" })
                        }
                        page={homeState.page}
                        pageCount={pageCount}
                      />
                    </>
                  )}
                </Paper>
                <MoodGraph domain={domain} moods={visibleMoods} />
                <MoodList
                  moods={visibleMoods}
                  navigate={navigate as NavigateFn}
                />
              </>
            ) : (
              <>
                <p>Welcome to MoodTracker!</p>
                <p>
                  <Link to="add">Click here to add your first mood</Link>
                </p>
              </>
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
      ) : (
        <Paper>
          <h2>Welcome to MoodTracker!</h2>
          <p>
            MoodTracker is a free and open source web app that lets you track
            your mood. It's simple to use, works offline and because it runs in
            your browser you can use it across all your devices!
          </p>
          <br />
          <p e-util="center">
            <strong>
              <Link to="sign-up">Sign up now to get started!</Link>
            </strong>
          </p>
          <br />
          <p>
            <small>
              If you already have an account you can{" "}
              <Link to="sign-in">sign in here</Link>.
            </small>
          </p>
        </Paper>
      )}
    </Paper.Group>
  );
}
