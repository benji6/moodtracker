import { Card, Pagination, Paper, SubHeading } from "eri";
import ExportControls from "../../Settings/Export/ExportControls";
import RedirectHome from "../../../shared/RedirectHome";
import SleepCard from "./SleepCard";
import eventsSlice from "../../../../store/eventsSlice";
import { mapRight } from "../../../../utils";
import { useSelector } from "react-redux";
import { useState } from "react";

const MAX_ITEMS_PER_PAGE = 10;

export default function SleepLog() {
  const sleeps = useSelector(
    eventsSlice.selectors.normalizedSleepsSortedByDateAwoke,
  );
  const denormalizedSleeps = useSelector(
    eventsSlice.selectors.denormalizedSleeps,
  );
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(sleeps.allIds.length / MAX_ITEMS_PER_PAGE);
  const endIndex = sleeps.allIds.length - MAX_ITEMS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_ITEMS_PER_PAGE);

  if (!sleeps.allIds.length) return <RedirectHome />;

  return (
    <Paper.Group>
      <Paper>
        <h2>Sleep log</h2>
        <h3>
          Export
          <SubHeading>
            Export all your sleeps (choose CSV format if you want to load your
            data into a spreadsheet)
          </SubHeading>
        </h3>
        <ExportControls
          category="sleeps"
          denormalizedData={denormalizedSleeps}
        />
        <h3>
          Log
          <SubHeading>View, edit or delete all your logged sleeps</SubHeading>
        </h3>
        <Card.Group>
          {mapRight(sleeps.allIds.slice(startIndex, endIndex), (id) => (
            <SleepCard key={id} id={id} />
          ))}
        </Card.Group>
        <Pagination onChange={setPage} page={page} pageCount={pageCount} />
      </Paper>
    </Paper.Group>
  );
}
