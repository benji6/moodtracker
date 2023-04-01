import "./style.css";
import { Card } from "eri";
import { useSelector } from "react-redux";
import { normalizedWeightsSelector } from "../../../../../selectors";
import { dateTimeFormatter } from "../../../../../formatters/dateTimeFormatters";
import { useNavigate } from "react-router-dom";
import { TEST_IDS } from "../../../../../constants";
import LocationString from "../../../../shared/LocationString";

interface Props {
  id: string;
}

export default function WeightCard({ id }: Props) {
  const weights = useSelector(normalizedWeightsSelector);
  const weight = weights.byId[id];
  const navigate = useNavigate();
  const date = new Date(id);

  return (
    <Card onClick={() => navigate(`/weight/edit/${id}`)}>
      <div className="m-weight-card">
        <div className="center">
          <b data-test-id={TEST_IDS.weightCardValue}>{weight.value}kg</b>
        </div>
        <div>
          <small
            data-test-id={TEST_IDS.weightCardTime}
            data-time={Math.round(date.getTime() / 1e3)}
          >
            {dateTimeFormatter.format(new Date(id))}
          </small>
        </div>
        <div>
          {weight.location && (
            <small>
              <LocationString
                errorFallback={
                  <>
                    Lat: {weight.location.latitude}
                    <br />
                    Lon: {weight.location.longitude}
                  </>
                }
                latitude={weight.location.latitude}
                longitude={weight.location.longitude}
              />
            </small>
          )}
        </div>
      </div>
    </Card>
  );
}
