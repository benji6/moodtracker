import { Card, Pagination, Paper } from "eri";
import { useState } from "react";
import { useSelector } from "react-redux";
import { normalizedWeightsSelector } from "../../../../selectors";
import { mapRight } from "../../../../utils";
import RedirectHome from "../../../RedirectHome";
import WeightCard from "./WeightCard";
import WeightDeleteDialog from "./WeightDeleteDialog";

const MAX_ITEMS_PER_PAGE = 10;

export default function Weight() {
  const weights = useSelector(normalizedWeightsSelector);
  const [dialogId, setDialogId] = useState<undefined | string>();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(weights.allIds.length / MAX_ITEMS_PER_PAGE);
  const endIndex = weights.allIds.length - MAX_ITEMS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_ITEMS_PER_PAGE);

  if (!weights.allIds.length) return <RedirectHome />;

  return (
    <Paper.Group>
      <Paper>
        <h2>Weight stats</h2>
      </Paper>
      <Paper>
        <h3>Log</h3>
        <Card.Group>
          {mapRight(weights.allIds.slice(startIndex, endIndex), (id) => (
            <WeightCard
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
        <WeightDeleteDialog
          id={dialogId}
          onClose={() => setIsOpen(false)}
          open={isOpen}
        />
      </Paper>
    </Paper.Group>
  );
}
