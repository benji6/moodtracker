import { Button, Icon, Paper, SubHeading } from "eri";
import { ReactNode, forwardRef } from "react";
import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventIcon from "./EventIcon";
import { EventTypeCategories } from "../../types";
import LiveLocation from "./LiveLocation";
import { TEST_IDS } from "../../constants";
import useKeyboardSave from "../hooks/useKeyboardSave";

interface Props {
  children: ReactNode;
  eventType: EventTypeCategories;
  onSubmit(): void;
  subheading?: string;
}

export default forwardRef<HTMLFormElement, Props>(function AddEvent(
  { children, eventType, onSubmit, subheading },
  ref,
) {
  useKeyboardSave(onSubmit);

  const { default: label } = EVENT_TYPE_TO_LABELS[eventType];

  return (
    <Paper.Group data-test-id={TEST_IDS.eventAddPage}>
      <Paper>
        <h2>
          <EventIcon eventType={eventType} /> Add {label}
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
