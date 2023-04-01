import "./style.css";
import { Button, Card, Icon } from "eri";
import { useSelector } from "react-redux";
import { dateTimeFormatter } from "../../../../../formatters/dateTimeFormatters";
import { normalizedMeditationsSelector } from "../../../../../selectors";
import { formatSecondsAsTime } from "../../../../../utils";
import LocationString from "../../../../shared/LocationString";

interface Props {
  id: string;
  onDelete(): void;
}

export default function MeditationCard({ id, onDelete }: Props) {
  const meditations = useSelector(normalizedMeditationsSelector);
  const meditation = meditations.byId[id];

  return (
    <Card>
      <div className="m-meditation-card">
        <div>
          <small>
            {dateTimeFormatter.format(new Date(id))}
            {meditation.location && (
              <>
                <br />
                <LocationString
                  latitude={meditation.location.latitude}
                  longitude={meditation.location.longitude}
                  successPostfix={<br />}
                />
                Latitude: {meditation.location.latitude}
                <br />
                Longitude: {meditation.location.longitude}
              </>
            )}
          </small>
        </div>
        <div className="center">
          <b>{formatSecondsAsTime(meditation.seconds)}</b>
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
