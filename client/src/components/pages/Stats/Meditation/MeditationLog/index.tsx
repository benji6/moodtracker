import { Card, Pagination, Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { normalizedMeditationsSelector } from "../../../../../selectors";
import { mapRight } from "../../../../../utils";
import MeditationCard from "./MeditationCard";
import MeditationDeleteDialog from "./MeditationDeleteDialog";

const MAX_ITEMS_PER_PAGE = 10;

export default function MeditationLog() {
  const meditations = useSelector(normalizedMeditationsSelector);
  const [dialogId, setDialogId] = React.useState<undefined | string>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(meditations.allIds.length / MAX_ITEMS_PER_PAGE);
  const endIndex = meditations.allIds.length - MAX_ITEMS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_ITEMS_PER_PAGE);

  return (
    <Paper>
      <h3>Log</h3>
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
  );
}
