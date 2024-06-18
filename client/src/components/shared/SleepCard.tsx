import EventCard from "./EventCard";
import { TEST_IDS } from "../../constants";
import { dateFormatter } from "../../formatters/dateTimeFormatters";
import eventsSlice from "../../store/eventsSlice";
import { formatMinutesToDurationStringLong } from "../../formatters/formatDuration";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function SleepCard({ id }: Props) {
  const sleeps = useSelector(eventsSlice.selectors.normalizedSleeps);
  const sleep = sleeps.byId[id];
  const date = new Date(sleep.dateAwoke);

  return (
    <EventCard eventType="sleeps" id={id}>
      <div>
        <small>
          Slept for:{" "}
          <b data-test-id={TEST_IDS.sleepCardValue}>
            {formatMinutesToDurationStringLong(sleep.minutesSlept)}
          </b>
        </small>
      </div>
      <div>
        <small data-time={Math.round(date.getTime() / 1e3)}>
          Woke up: <b>{dateFormatter.format(date)}</b>
        </small>
      </div>
    </EventCard>
  );
}
