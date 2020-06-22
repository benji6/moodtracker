import { Link, NavigateFn, RouteComponentProps } from "@reach/router";
import { Paper, Fab, Icon, Spinner, RadioButton } from "eri";
import * as React from "react";
import { StateContext } from "../../AppState";
import MoodGraph from "./MoodGraph";
import MoodList from "./MoodList";

export default function Home({ navigate }: RouteComponentProps) {
  const state = React.useContext(StateContext);
  const [dayCount, setDayCount] = React.useState(7);

  const now = Date.now();

  const visibleMoods = {
    ...state.moods,
    allIds: state.moods.allIds.filter(
      (id) => now - new Date(id).getTime() < dayCount * 86400000
    ),
  };

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
                            onChange={() => setDayCount(n)}
                            checked={dayCount === n}
                            value={n}
                          >
                            {n}
                          </RadioButton>
                        )),
                      <RadioButton
                        key="all"
                        name="day-count"
                        onChange={() => setDayCount(Infinity)}
                        checked={dayCount === Infinity}
                        value={Infinity}
                      >
                        All
                      </RadioButton>,
                    ]}
                  </RadioButton.Group>
                </Paper>
                <MoodGraph moods={visibleMoods} />
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
