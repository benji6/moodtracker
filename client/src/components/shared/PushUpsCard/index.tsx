import "./style.css";
import { Card } from "eri";
import LocationString from "../LocationString";
import { TEST_IDS } from "../../../constants";
import { dateTimeFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function PushUpsCard({ id }: Props) {
  const normalizedPushUps = useSelector(
    eventsSlice.selectors.normalizedPushUps,
  );
  const pushUps = normalizedPushUps.byId[id];
  const navigate = useNavigate();
  const date = new Date(id);

  return (
    <Card onClick={() => navigate(`/push-ups/edit/${id}`)}>
      <div className="m-push-ups-card">
        <div className="center">
          <b data-test-id={TEST_IDS.pushUpsCardValue}>
            {pushUps.value} push-up{pushUps.value === 1 ? "" : "s"}
          </b>
        </div>
        <div>
          <small
            data-test-id={TEST_IDS.pushUpsCardTime}
            data-time={Math.round(date.getTime() / 1e3)}
          >
            {dateTimeFormatter.format(new Date(id))}
          </small>
        </div>
        <div>
          {pushUps.location && (
            <small>
              <LocationString
                errorFallback={
                  <>
                    Lat: {pushUps.location.latitude}
                    <br />
                    Lon: {pushUps.location.longitude}
                  </>
                }
                latitude={pushUps.location.latitude}
                longitude={pushUps.location.longitude}
              />
            </small>
          )}
        </div>
      </div>
    </Card>
  );
}
