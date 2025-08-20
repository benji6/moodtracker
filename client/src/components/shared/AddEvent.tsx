import { Button, Icon, Paper, SubHeading } from "eri";
import { ReactNode } from "react";
import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventIcon from "./EventIcon";
import { EventTypeCategories } from "../../types";
import LiveLocation from "./LiveLocation";
import { TEST_IDS } from "../../constants";
import useKeyboardSave from "../hooks/useKeyboardSave";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
  eventType: EventTypeCategories;
  onSubmit(): boolean; // `true` if successful, otherwise `false`;
  ref: React.ForwardedRef<HTMLFormElement>;
  showLocation?: boolean;
  subheading?: string;
}

export default function AddEvent({
  children,
  eventType,
  onSubmit,
  ref,
  showLocation = true,
  subheading,
}: Props) {
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (onSubmit()) navigate("/");
  };
  useKeyboardSave(handleSubmit);

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
            handleSubmit();
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
      {showLocation && <LiveLocation />}
    </Paper.Group>
  );
}
