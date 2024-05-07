import { Button, Icon, Paper, SubHeading } from "eri";
import { ReactNode, forwardRef } from "react";
import LiveLocation from "./LiveLocation";
import { TEST_IDS } from "../../constants";
import useKeyboardSave from "../hooks/useKeyboardSave";

interface Props {
  children: ReactNode;
  eventTypeLabel: string;
  onSubmit(): void;
  subheading?: string;
}

export default forwardRef<HTMLFormElement, Props>(function AddEvent(
  { children, eventTypeLabel, onSubmit, subheading },
  ref,
) {
  useKeyboardSave(onSubmit);

  return (
    <Paper.Group data-test-id={TEST_IDS.eventAddPage}>
      <Paper>
        <h2>
          Add {eventTypeLabel}
          {subheading && <SubHeading>{subheading}</SubHeading>}
        </h2>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          ref={ref}
        >
          {children}
          <Button.Group>
            <Button data-test-id={TEST_IDS.eventAddSubmitButton}>
              <Icon margin="end" name="save" />
              Save
            </Button>
          </Button.Group>
        </form>
      </Paper>
      <LiveLocation />
    </Paper.Group>
  );
});
