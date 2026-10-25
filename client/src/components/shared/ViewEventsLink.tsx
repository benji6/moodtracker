import { Link } from "react-router";
import { eventLogUrl } from "../../eventLog";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function ViewEventsLink({ dateFrom, dateTo }: Props) {
  return (
    <p>
      <Link to={eventLogUrl(dateFrom, dateTo)}>View events</Link>
    </p>
  );
}
