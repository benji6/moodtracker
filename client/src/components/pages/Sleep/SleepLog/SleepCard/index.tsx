import "./style.css";
import { Card } from "eri";
import { TEST_IDS } from "../../../../../constants";
import { dateFormatter } from "../../../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../../../store/eventsSlice";
import { formatMinutesAsTimeStringLong } from "../../../../../formatters/formatMinutesAsTimeString";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function SleepCard({ id }: Props) {
  const sleeps = useSelector(eventsSlice.selectors.normalizedSleeps);
  const sleep = sleeps.byId[id];
  const navigate = useNavigate();
  const date = new Date(sleep.dateAwoke);

  return (
    <Card onClick={() => navigate(`/sleep/edit/${id}`)}>
      <div className="m-sleep-card">
        <div>
          <small>
            Slept for:{" "}
            <b data-test-id={TEST_IDS.sleepCardValue}>
              {formatMinutesAsTimeStringLong(sleep.minutesSlept)}
            </b>
          </small>
        </div>
        <div>
          <small data-time={Math.round(date.getTime() / 1e3)}>
            Woke up: <b>{dateFormatter.format(date)}</b>
          </small>
        </div>
      </div>
    </Card>
  );
}
