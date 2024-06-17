import "./style.css";
import { Card } from "eri";
import LocationString from "../LocationString";
import { TEST_IDS } from "../../../constants";
import { dateTimeFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { formatMetersToOneNumberWithUnits } from "../../../formatters/formatDistance";
import { formatSecondsAsTime } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function RunCard({ id }: Props) {
  const normalizedEvents = useSelector(eventsSlice.selectors.normalizedRuns);
  const event = normalizedEvents.byId[id];
  const navigate = useNavigate();
  const date = new Date(id);
  const { location } = event;

  return (
    <Card onClick={() => navigate(`/runs/edit/${id}`)}>
      <div className="m-run-card">
        <div className="center">
          {event.meters !== undefined && (
            <b data-test-id={TEST_IDS.runCardDistance}>
              {formatMetersToOneNumberWithUnits(event.meters)}
            </b>
          )}
          {event.meters !== undefined && event.seconds !== undefined && <br />}
          {event.seconds !== undefined && (
            <b data-test-id={TEST_IDS.runCardTime}>
              {formatSecondsAsTime(event.seconds)}
            </b>
          )}
        </div>
        <div>
          <small
            data-test-id={TEST_IDS.eventCardTime}
            data-time={Math.round(date.getTime() / 1e3)}
          >
            {dateTimeFormatter.format(date)}
          </small>
        </div>
        <div>
          {location && (
            <small>
              <LocationString
                errorFallback={
                  <>
                    Lat: {location.latitude}
                    <br />
                    Lon: {location.longitude}
                  </>
                }
                latitude={location.latitude}
                longitude={location.longitude}
              />
            </small>
          )}
        </div>
      </div>
    </Card>
  );
}
