import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventIcon from "./EventIcon";
import { EventTypeCategories } from "../../types";
import { Toggle } from "eri";
import appSlice from "../../store/appSlice";
import { capitalizeFirstLetter } from "../../utils";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function EventTrackingSettings() {
  const eventTypeTracking = useSelector(appSlice.selectors.eventTypeTracking);
  const dispatch = useDispatch();

  return (
    <>
      <p>You can turn off any event types you don&apos;t want to track here.</p>
      {Object.entries(EVENT_TYPE_TO_LABELS)
        .filter(([eventType]) => eventType !== "moods")
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([eventType, { plural }]) => {
          const checked = eventTypeTracking[eventType as EventTypeCategories];
          return (
            <Toggle
              key={eventType}
              checked={checked}
              onChange={() =>
                dispatch(
                  appSlice.actions.toggleEventTrackingForEvent(
                    eventType as EventTypeCategories,
                  ),
                )
              }
              label={
                <>
                  <EventIcon
                    eventType={eventType as EventTypeCategories}
                    margin="end"
                  />
                  {capitalizeFirstLetter(plural)}
                </>
              }
            />
          );
        })}
    </>
  );
}
