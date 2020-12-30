import { RouteComponentProps, Redirect, useNavigate } from "@reach/router";
import * as React from "react";
import { Button, Paper, RadioButton, TextArea, TextField } from "eri";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import DeleteDialog from "./DeleteDialog";
import { moodsSelector } from "../../../selectors";
import { useDispatch, useSelector } from "react-redux";
import eventsSlice from "../../../store/eventsSlice";
import { noPunctuationValidator } from "../../../validators";
import { ServerMood } from "../../../types";

export default function EditMood({ id }: RouteComponentProps<{ id: string }>) {
  useRedirectUnauthed();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const moods = useSelector(moodsSelector);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState<
    string | undefined
  >();
  if (!id) return <Redirect to="/404" />;
  const mood = moods.byId[id];
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
            const formEl = e.target as HTMLFormElement;
            const descriptionValue: string = formEl.description.value;
            const explorationValue: string = formEl.exploration.value;
            const moodValue: string = formEl.mood.value;

            const descriptionFieldError = noPunctuationValidator(
              descriptionValue
            );

            if (descriptionFieldError)
              return setDescriptionError(descriptionFieldError);

            const payload: ServerMood = { id, mood: Number(moodValue) };
            if (descriptionValue) payload.description = descriptionValue.trim();
            if (explorationValue) payload.exploration = explorationValue.trim();

            dispatch(
              eventsSlice.actions.add({
                type: "v1/moods/update",
                createdAt: new Date().toISOString(),
                payload,
              })
            );
            navigate("/");
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
          <TextField
            autoComplete="on"
            defaultValue={mood.description}
            error={descriptionError}
            label="Description"
            maxLength={32}
            name="description"
            optional
            supportiveText="Try to describe how you feel using a short (32 characters) list of words separated by spaces."
          />
          <TextArea
            defaultValue={mood.exploration}
            label="Exploration"
            name="exploration"
            optional
            rows={5}
            supportiveText="This is a space to explore how you're feeling, why you're feeling that way and what's going on in your life right now"
          />
          <Button.Group>
            <Button>Update</Button>
            <Button danger onClick={() => setIsDialogOpen(true)} type="button">
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
        <DeleteDialog
          id={id}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
        />
      </Paper>
    </Paper.Group>
  );
}
