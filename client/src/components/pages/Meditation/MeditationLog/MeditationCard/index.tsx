import "./style.css";
import { Button, Card, Icon } from "eri";
import { useSelector } from "react-redux";
import { dateTimeFormatter } from "../../../../../formatters/dateTimeFormatters";
import { formatSecondsAsTime } from "../../../../../utils";
import LocationString from "../../../../shared/LocationString";
import {
  floatDegreeFormatter,
  integerMeterFormatter,
} from "../../../../../formatters/numberFormatters";
import eventsSlice from "../../../../../store/eventsSlice";

interface Props {
  id: string;
  onDelete(): void;
}

export default function MeditationCard({ id, onDelete }: Props) {
  const meditations = useSelector(eventsSlice.selectors.normalizedMeditations);
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
                Latitude:{" "}
                {floatDegreeFormatter.format(meditation.location.latitude)}
                <br />
                Longitude:{" "}
                {floatDegreeFormatter.format(meditation.location.longitude)}
                {meditation.location.altitude && (
                  <>
                    <br />
                    Altitude:{" "}
                    {integerMeterFormatter.format(meditation.location.altitude)}
                  </>
                )}
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
