import "./style.css";
import { Button, Card, Icon } from "eri";
import { useSelector } from "react-redux";
import { normalizedWeightsSelector } from "../../../../../selectors";
import { dateTimeFormatter } from "../../../../../formatters/dateTimeFormatters";

interface Props {
  id: string;
  onDelete(): void;
}

export default function WeightCard({ id, onDelete }: Props) {
  const weights = useSelector(normalizedWeightsSelector);
  const weight = weights.byId[id];

  return (
    <Card>
      <div className="m-weight-card">
        <div>
          <small>
            {dateTimeFormatter.format(new Date(id))}
            {weight.location && (
              <>
                <br />
                Latitude: {weight.location.latitude}
                <br />
                Longitude: {weight.location.longitude}
              </>
            )}
          </small>
        </div>
        <div className="center">
          <b>{weight.value}</b>
        </div>
        <div>
          <Button danger onClick={onDelete} type="button" variant="tertiary">
            <Icon aria-label="Delete" margin="end" name="cross" size="3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
