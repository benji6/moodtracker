import "./style.css";
import { Button, Card, Icon } from "eri";
import EventIcon from "../EventIcon";
import MeditationDeleteDialog from "./MeditationDeleteDialog";
import { dateTimeFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { formatSecondsToDurationStringShort } from "../../../formatters/formatDuration";
import { useSelector } from "react-redux";
import { useState } from "react";
import { TEST_IDS } from "../../../constants";

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
            <EventIcon eventType="meditations" />
          </div>
          <div>
            <b data-test-id={TEST_IDS.meditationCardDuration}>
              {formatSecondsToDurationStringShort(meditation.seconds)}
            </b>
          </div>
          <div>
            <small>{dateTimeFormatter.format(new Date(id))}</small>
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
