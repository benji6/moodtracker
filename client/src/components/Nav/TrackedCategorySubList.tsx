import { Nav as EriNav, Icon } from "eri";
import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventIcon from "../shared/EventIcon";
import { EventTypeCategories } from "../../types";
import { capitalizeFirstLetter } from "../../utils";

export default function TrackedCategorySubList({
  eventType,
  onClick,
  showLog = false,
}: {
  eventType: EventTypeCategories;
  onClick(): void;
  showLog?: boolean;
}) {
  return (
    <EriNav.SubList
      heading={
        <span>
          <EventIcon eventType={eventType} margin="end" />
          {capitalizeFirstLetter(EVENT_TYPE_TO_LABELS[eventType].default)}
        </span>
      }
    >
      <EriNav.Link onClick={onClick} to={`/${eventType}/add`}>
        <Icon margin="end" name="plus" />
        Add
      </EriNav.Link>
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
