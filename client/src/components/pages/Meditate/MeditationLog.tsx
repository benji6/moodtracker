import { Pagination, Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { TIME } from "../../../constants";
import { dateFormatter, timeFormatter } from "../../../dateTimeFormatters";
import { integerFormatter } from "../../../numberFormatters";
import { normalizedMeditationsSelector } from "../../../selectors";
import { mapRight } from "../../../utils";

const MAX_ITEMS_PER_PAGE = 10;

export default function MeditationLog() {
  const meditations = useSelector(normalizedMeditationsSelector);
  const [page, setPage] = React.useState(0);

  if (!meditations.allIds.length) return null;

  const pageCount = Math.ceil(meditations.allIds.length / MAX_ITEMS_PER_PAGE);
  const endIndex = meditations.allIds.length - MAX_ITEMS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_ITEMS_PER_PAGE);

  return (
    <Paper>
      <h3>Log</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time finished</th>
            <th>Minutes</th>
          </tr>
        </thead>
        <tbody>
          {mapRight(meditations.allIds.slice(startIndex, endIndex), (id) => {
            return (
              <tr key={id}>
                <td>{dateFormatter.format(new Date(id))}</td>
                <td>{timeFormatter.format(new Date(id))}</td>
                <td>
                  {integerFormatter.format(
                    meditations.byId[id].seconds / TIME.secondsPerMinute
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination onChange={setPage} page={page} pageCount={pageCount} />
    </Paper>
  );
}
