import "./style.css";
import { Button, Card, Icon } from "eri";
import {
  floatDegreeFormatter,
  integerMeterFormatter,
} from "../../../formatters/numberFormatters";
import LocationString from "../LocationString";
import MeditationDeleteDialog from "./MeditationDeleteDialog";
import { dateTimeFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { formatSecondsAsTime } from "../../../utils";
import { useSelector } from "react-redux";
import { useState } from "react";

interface Props {
  id: string;
}

export default function MeditationCard({ id }: Props) {
  const meditations = useSelector(eventsSlice.selectors.normalizedMeditations);
  const meditation = meditations.byId[id];
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
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
                      {integerMeterFormatter.format(
                        meditation.location.altitude,
                      )}
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
            <Button
              danger
              onClick={() => setIsDeleteDialogOpen(true)}
              type="button"
              variant="tertiary"
            >
              <Icon aria-label="Delete" margin="end" name="cross" size="3" />
            </Button>
          </div>
        </div>
      </Card>
      <MeditationDeleteDialog
        id={id}
        onClose={() => setIsDeleteDialogOpen(false)}
        open={isDeleteDialogOpen}
      />
    </>
  );
}
