import { Card, Pagination, Paper, SubHeading } from "eri";
import {
  DenormalizedEvents,
  EventTypeCategories,
  NormalizedEvents,
} from "../../types";
import { FC, useState } from "react";
import { capitalizeFirstLetter, mapRight } from "../../utils";
import ExportControls from "./ExportControls";
import RedirectHome from "./RedirectHome";

const MAX_ITEMS_PER_PAGE = 10;

interface Props {
  CardComponent: FC<{ id: string }>;
  denormalizedEvents: DenormalizedEvents;
  eventType: EventTypeCategories;
  eventTypeLabel: string;
  eventTypeLabelPlural: string;
  normalizedEvents: NormalizedEvents;
}

export default function EventLog({
  CardComponent,
  denormalizedEvents,
  eventType,
  eventTypeLabel,
  eventTypeLabelPlural,
  normalizedEvents,
}: Props) {
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(
    normalizedEvents.allIds.length / MAX_ITEMS_PER_PAGE,
  );
  const endIndex = normalizedEvents.allIds.length - MAX_ITEMS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_ITEMS_PER_PAGE);

  if (!normalizedEvents.allIds.length) return <RedirectHome />;

  return (
    <Paper.Group>
      <Paper>
        <h2>{capitalizeFirstLetter(eventTypeLabel)} log</h2>
        <h3>
          Export
          <SubHeading>
            Export all your logged {eventTypeLabelPlural} (choose CSV format if
            you want to load your data into a spreadsheet)
          </SubHeading>
        </h3>
        <ExportControls
          category={eventType}
          denormalizedData={denormalizedEvents}
        />
        <h3>
          Log
          <SubHeading>
            View, edit or delete all your logged {eventTypeLabelPlural}
          </SubHeading>
        </h3>
        <Card.Group>
          {mapRight(
            normalizedEvents.allIds.slice(startIndex, endIndex),
            (id) => (
              <CardComponent key={id} id={id} />
            ),
          )}
        </Card.Group>
        <Pagination onChange={setPage} page={page} pageCount={pageCount} />
      </Paper>
    </Paper.Group>
  );
}
