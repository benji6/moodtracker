import { dateTimeFormatter } from "../../formatters/dateTimeFormatters";
import { formatDistanceToNow } from "date-fns";

interface Props {
  dateCreated: Date;
  dateUpdated?: Date;
}

export default function TimeDisplayForEditEventForm({
  dateCreated,
  dateUpdated,
}: Props) {
  return (
    <p>
      <small>
        Created: {dateTimeFormatter.format(dateCreated)} (
        {formatDistanceToNow(dateCreated)} ago)
      </small>
      {dateUpdated && (
        <>
          <br />
          <small>
            Last updated: {dateTimeFormatter.format(dateUpdated)} (
            {formatDistanceToNow(dateUpdated)} ago)
          </small>
        </>
      )}
    </p>
  );
}
