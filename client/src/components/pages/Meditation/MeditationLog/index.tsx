import { Card, Pagination, Paper, SubHeading } from "eri";
import ExportControls from "../../Settings/Export/ExportControls";
import MeditationCard from "./MeditationCard";
import eventsSlice from "../../../../store/eventsSlice";
import { mapRight } from "../../../../utils";
import { useSelector } from "react-redux";
import { useState } from "react";

const MAX_ITEMS_PER_PAGE = 10;

export default function MeditationLog() {
  const meditations = useSelector(eventsSlice.selectors.normalizedMeditations);
  const denormalizedMeditations = useSelector(
    eventsSlice.selectors.denormalizedMeditations,
  );
  const [page, setPage] = useState(0);

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
            <MeditationCard key={id} id={id} />
          ))}
        </Card.Group>
        <Pagination onChange={setPage} page={page} pageCount={pageCount} />
      </Paper>
    </Paper.Group>
  );
}
