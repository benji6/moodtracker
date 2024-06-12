import "./style.css";
import {
  EVENT_TYPE_TO_ICON,
  EVENT_TYPE_TO_LABEL,
} from "../../../constants/eventTypeMappings";
import { Nav as EriNav, Icon } from "eri";
import { EventTypeCategories } from "../../../types";
import { capitalizeFirstLetter } from "../../../utils";

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
          <span className="m-tracked-category-sub-list__icon">
            {EVENT_TYPE_TO_ICON[eventType]}
          </span>
          {capitalizeFirstLetter(EVENT_TYPE_TO_LABEL[eventType])}
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
