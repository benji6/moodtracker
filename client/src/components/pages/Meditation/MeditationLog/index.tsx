import { Card, Pagination, Paper, SubHeading } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  denormalizedMeditationsSelector,
  normalizedMeditationsSelector,
} from "../../../../selectors";
import { mapRight } from "../../../../utils";
import ExportControls from "../../Settings/Export/ExportControls";
import MeditationCard from "./MeditationCard";
import MeditationDeleteDialog from "./MeditationDeleteDialog";

const MAX_ITEMS_PER_PAGE = 10;

export default function MeditationLog() {
  const meditations = useSelector(normalizedMeditationsSelector);
  const denormalizedMeditations = useSelector(denormalizedMeditationsSelector);
  const [dialogId, setDialogId] = React.useState<undefined | string>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(meditations.allIds.length / MAX_ITEMS_PER_PAGE);
  const endIndex = meditations.allIds.length - MAX_ITEMS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_ITEMS_PER_PAGE);

  return (
    <Paper.Group>
      <Paper>
        <h2>Meditation log</h2>
        <h3>
          Export
          <SubHeading>
            Export all your meditations (choose CSV format if you want to load
            your data into a spreadsheet)
          </SubHeading>
        </h3>
        <ExportControls
          category="meditations"
          denormalizedData={denormalizedMeditations}
        />
        <h3>
          Log
          <SubHeading>
            View, edit or delete all your logged meditations
          </SubHeading>
        </h3>
        <Card.Group>
          {mapRight(meditations.allIds.slice(startIndex, endIndex), (id) => (
            <MeditationCard
              key={id}
              id={id}
              onDelete={() => {
                setDialogId(id);
                setIsOpen(true);
              }}
            />
          ))}
        </Card.Group>
        <Pagination onChange={setPage} page={page} pageCount={pageCount} />
        <MeditationDeleteDialog
          id={dialogId}
          onClose={() => setIsOpen(false)}
          open={isOpen}
        />
      </Paper>
    </Paper.Group>
  );
}
