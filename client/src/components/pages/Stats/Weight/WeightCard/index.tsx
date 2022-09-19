import "./style.css";
import { Card } from "eri";
import { useSelector } from "react-redux";
import { normalizedWeightsSelector } from "../../../../../selectors";
import { dateTimeFormatter } from "../../../../../formatters/dateTimeFormatters";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
}

export default function WeightCard({ id }: Props) {
  const weights = useSelector(normalizedWeightsSelector);
  const weight = weights.byId[id];
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/weight/edit/${id}`)}>
      <div className="m-weight-card">
        <div className="center">
          <b>{weight.value}kg</b>
        </div>
        <div>
          <small>{dateTimeFormatter.format(new Date(id))}</small>
        </div>
        <div>
          {weight.location && (
            <small>
              Lat: {weight.location.latitude}
              <br />
              Long: {weight.location.longitude}
            </small>
          )}
        </div>
      </div>
    </Card>
  );
}
