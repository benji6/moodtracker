import { Button, Icon, Pagination, Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { dateTimeFormatter } from "../../../../../dateTimeFormatters";
import { normalizedMeditationsSelector } from "../../../../../selectors";
import { formatSecondsAsTime, mapRight } from "../../../../../utils";
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
      <table>
        <thead>
          <tr>
            <th>Time finished</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {mapRight(meditations.allIds.slice(startIndex, endIndex), (id) => {
            return (
              <tr key={id}>
                <td>{dateTimeFormatter.format(new Date(id))}</td>
                <td>{formatSecondsAsTime(meditations.byId[id].seconds)}</td>
                <td>
                  <Button
                    danger
                    onClick={() => {
                      setDialogId(id);
                      setIsOpen(true);
                    }}
                    type="button"
                    variant="tertiary"
                  >
                    <Icon aria-label="Delete" margin="right" name="cross" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination onChange={setPage} page={page} pageCount={pageCount} />
      <MeditationDeleteDialog
        id={dialogId}
        onClose={() => setIsOpen(false)}
        open={isOpen}
      />
    </Paper>
  );
}
