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

export default function SitUpsCard({ id }: Props) {
  const normalizedSitUps = useSelector(eventsSlice.selectors.normalizedSitUps);
  const sitUps = normalizedSitUps.byId[id];
  const navigate = useNavigate();
  const date = new Date(id);

  return (
    <Card onClick={() => navigate(`/sit-ups/edit/${id}`)}>
      <div className="m-sit-ups-card">
        <div className="center">
          <b data-test-id={TEST_IDS.sitUpsCardValue}>
            {sitUps.value} sit-up{sitUps.value === 1 ? "" : "s"}
          </b>
        </div>
        <div>
          <small
            data-test-id={TEST_IDS.sitUpsCardTime}
            data-time={Math.round(date.getTime() / 1e3)}
          >
            {dateTimeFormatter.format(new Date(id))}
          </small>
        </div>
        <div>
          {sitUps.location && (
            <small>
              <LocationString
                errorFallback={
                  <>
                    Lat: {sitUps.location.latitude}
                    <br />
                    Lon: {sitUps.location.longitude}
                  </>
                }
                latitude={sitUps.location.latitude}
                longitude={sitUps.location.longitude}
              />
            </small>
          )}
        </div>
      </div>
    </Card>
  );
}
