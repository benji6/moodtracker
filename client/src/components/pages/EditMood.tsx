import { RouteComponentProps, NavigateFn, Redirect } from "@reach/router";
import * as React from "react";
import { Button, Paper, RadioButton } from "eri";
import { DispatchContext, StateContext } from "../AppState";
import useRedirectUnauthed from "../hooks/useRedirectUnauthed";

export default function EditMood({
  id,
  navigate,
}: RouteComponentProps<{ id: string }>) {
  useRedirectUnauthed();
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);
  if (!id) return <Redirect to="/404" />;
  const mood = state.moods.byId[id];
  if (!mood) return <Redirect to="/404" />;
  return (
    <Paper.Group>
      <Paper>
        <h2>Edit mood</h2>
        <p>
          <small>Created: {new Date(id).toLocaleString()}</small>
          {mood.updatedAt && (
            <>
              <br />
              <small>
                Last updated: {new Date(mood.updatedAt).toLocaleString()}
              </small>
            </>
          )}
        </p>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "events/add",
              payload: {
                type: "v1/moods/update",
                createdAt: new Date().toISOString(),
                payload: {
                  id,
                  mood: Number((e.target as HTMLFormElement).mood.value),
                },
              },
            });
            (navigate as NavigateFn)("/");
          }}
        >
          <RadioButton.Group label="Mood">
            {[...Array(11)].map((_, i) => (
              <RadioButton
                // There is old data where mood is a float between 0 and 10
                // We handle that by rounding for this input control
                defaultChecked={Math.round(mood.mood) === i}
                key={i}
                name="mood"
                value={i}
              >
                {i}
              </RadioButton>
            ))}
          </RadioButton.Group>
          <Button.Group>
            <Button>Update</Button>
            <Button
              danger
              onClick={() =>
                dispatch({
                  type: "events/add",
                  payload: {
                    type: "v1/moods/delete",
                    createdAt: new Date().toISOString(),
                    payload: id,
                  },
                })
              }
            >
              Delete
            </Button>
            <Button
              onClick={() => window.history.back()}
              type="button"
              variant="secondary"
            >
              Back
            </Button>
          </Button.Group>
        </form>
      </Paper>
    </Paper.Group>
  );
}
