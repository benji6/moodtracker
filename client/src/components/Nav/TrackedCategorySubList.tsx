import { Nav as EriNav, Icon } from "eri";
import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventIcon from "../shared/EventIcon";
import { EventTypeCategories } from "../../types";
import appSlice from "../../store/appSlice";
import { capitalizeFirstLetter } from "../../utils";
import { useSelector } from "react-redux";

export default function TrackedCategorySubList({
  eventType,
  onClick,
  showLog = false,
}: {
  eventType: EventTypeCategories;
  onClick(): void;
  showLog?: boolean;
}) {
  const eventTypeTracking = useSelector(appSlice.selectors.eventTypeTracking);

  const isTrackingEnabled = eventTypeTracking[eventType];

  if (!isTrackingEnabled && !showLog) return;

  return (
    <EriNav.SubList
      heading={
        <span>
          <EventIcon eventType={eventType} margin="end" />
          {capitalizeFirstLetter(EVENT_TYPE_TO_LABELS[eventType].default)}
        </span>
      }
    >
      {isTrackingEnabled && (
        <EriNav.Link onClick={onClick} to={`/${eventType}/add`}>
          <Icon margin="end" name="plus" />
          Add
        </EriNav.Link>
      )}
      {showLog && (
        <>
          <EriNav.Link onClick={onClick} to={`/${eventType}/log`}>
            <Icon margin="end" name="book" />
            Log
          </EriNav.Link>
        </>
      )}
    </EriNav.SubList>
  );
}
