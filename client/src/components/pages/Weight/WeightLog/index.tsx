import { Card, Pagination, Paper, SubHeading } from "eri";
import ExportControls from "../../Settings/Export/ExportControls";
import RedirectHome from "../../../shared/RedirectHome";
import WeightCard from "./WeightCard";
import eventsSlice from "../../../../store/eventsSlice";
import { mapRight } from "../../../../utils";
import { useSelector } from "react-redux";
import { useState } from "react";

const MAX_ITEMS_PER_PAGE = 10;

export default function WeightLog() {
  const weights = useSelector(eventsSlice.selectors.normalizedWeights);
  const denormalizedWeights = useSelector(
    eventsSlice.selectors.denormalizedWeights,
  );
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(weights.allIds.length / MAX_ITEMS_PER_PAGE);
  const endIndex = weights.allIds.length - MAX_ITEMS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_ITEMS_PER_PAGE);

  if (!weights.allIds.length) return <RedirectHome />;

  return (
    <Paper.Group>
      <Paper>
        <h2>Weight log</h2>
        <h3>
          Export
          <SubHeading>
            Export all your weights (choose CSV format if you want to load your
            data into a spreadsheet)
          </SubHeading>
        </h3>
        <ExportControls
          category="weights"
          denormalizedData={denormalizedWeights}
        />
        <h3>
          Log
          <SubHeading>View, edit or delete all your logged weights</SubHeading>
        </h3>
        <Card.Group>
          {mapRight(weights.allIds.slice(startIndex, endIndex), (id) => (
            <WeightCard key={id} id={id} />
          ))}
        </Card.Group>
        <Pagination onChange={setPage} page={page} pageCount={pageCount} />
      </Paper>
    </Paper.Group>
  );
}
