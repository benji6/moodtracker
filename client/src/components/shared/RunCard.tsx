import EventCard from "./EventCard";
import { TEST_IDS } from "../../constants";
import eventsSlice from "../../store/eventsSlice";
import { formatMetersToOneNumberWithUnits } from "../../formatters/formatDistance";
import { formatSecondsAsTime } from "../../formatters/formatDuration";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function RunCard({ id }: Props) {
  const normalizedEvents = useSelector(eventsSlice.selectors.normalizedRuns);
  const event = normalizedEvents.byId[id];

  return (
    <EventCard eventType="runs" id={id}>
      <div>
        {event.meters !== undefined && (
          <b data-test-id={TEST_IDS.runCardDistance}>
            {formatMetersToOneNumberWithUnits(event.meters)}
          </b>
        )}
        {event.meters !== undefined && event.seconds !== undefined && <br />}
        {event.seconds != undefined && (
          <b data-test-id={TEST_IDS.runCardTime}>
            {formatSecondsAsTime(event.seconds)}
          </b>
        )}
      </div>
    </EventCard>
  );
}
