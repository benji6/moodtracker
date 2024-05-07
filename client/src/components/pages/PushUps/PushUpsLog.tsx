import { Card, Pagination, Paper, SubHeading } from "eri";
import ExportControls from "../Settings/Export/ExportControls";
import PushUpsCard from "../../shared/PushUpsCard";
import RedirectHome from "../../shared/RedirectHome";
import eventsSlice from "../../../store/eventsSlice";
import { mapRight } from "../../../utils";
import { useSelector } from "react-redux";
import { useState } from "react";

const MAX_ITEMS_PER_PAGE = 10;

export default function PushUpsLog() {
  const normalizedPushUps = useSelector(
    eventsSlice.selectors.normalizedPushUps,
  );
  const denormalizedPushUps = useSelector(
    eventsSlice.selectors.denormalizedPushUps,
  );
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(
    normalizedPushUps.allIds.length / MAX_ITEMS_PER_PAGE,
  );
  const endIndex = normalizedPushUps.allIds.length - MAX_ITEMS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_ITEMS_PER_PAGE);

  if (!normalizedPushUps.allIds.length) return <RedirectHome />;

  return (
    <Paper.Group>
      <Paper>
        <h2>Push-ups log</h2>
        <h3>
          Export
          <SubHeading>
            Export all your push-ups (choose CSV format if you want to load your
            data into a spreadsheet)
          </SubHeading>
        </h3>
        <ExportControls
          category="push-ups"
          denormalizedData={denormalizedPushUps}
        />
        <h3>
          Log
          <SubHeading>View, edit or delete all your logged push-ups</SubHeading>
        </h3>
        <Card.Group>
          {mapRight(
            normalizedPushUps.allIds.slice(startIndex, endIndex),
            (id) => (
              <PushUpsCard key={id} id={id} />
            ),
          )}
        </Card.Group>
        <Pagination onChange={setPage} page={page} pageCount={pageCount} />
      </Paper>
    </Paper.Group>
  );
}
