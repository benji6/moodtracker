import { Nav as EriNav, Icon } from "eri";
import { EventTypeCategories } from "../../types";
import { ReactNode } from "react";

export default function TrackedCategorySubList({
  eventType,
  heading,
  onClick,
  showLog = false,
}: {
  eventType: EventTypeCategories;
  heading: ReactNode;
  onClick(): void;
  showLog?: boolean;
}) {
  return (
    <EriNav.SubList heading={<span>{heading}</span>}>
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
