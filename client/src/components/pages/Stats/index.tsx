import { Link, RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import GetStartedCta from "../../shared/GetStartedCta";
import Months from "./Months";
import Weeks from "./Weeks";
import {
  appIsStorageLoadingSelector,
  eventsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import { useSelector } from "react-redux";
import Years from "./Years";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../utils";
import startOfWeek from "date-fns/startOfWeek";
import { WEEK_OPTIONS } from "../../../formatters";

export default function Stats(_: RouteComponentProps) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(normalizedMoodsSelector);
  if (useSelector(appIsStorageLoadingSelector)) return <Spinner />;

  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <GetStartedCta />
      </Paper.Group>
    );

  if (!events.hasLoadedFromServer) return <Spinner />;
  const now = new Date();

  return (
    <Paper.Group>
      <Paper>
        <h2>Stats</h2>
        <ul>
          <li>
            <Link
              to={`/stats/weeks/${formatIsoDateInLocalTimezone(
                startOfWeek(now, WEEK_OPTIONS)
              )}`}
            >
              This week
            </Link>
          </li>
          <li>
            <Link to={`/stats/months/${formatIsoMonthInLocalTimezone(now)}`}>
              This month
            </Link>
          </li>
          <li>
            <Link to={`/stats/years/${formatIsoYearInLocalTimezone(now)}`}>
              This year
            </Link>
          </li>
          <li>
            <Link to="/stats/explore">Explore</Link>
          </li>
        </ul>
      </Paper>
      <Weeks />
      <Months />
      <Years />
      <Paper>
        <h2>Explore</h2>
        <p className="center">
          <Link to="/stats/explore">More insights here</Link>
        </p>
      </Paper>
    </Paper.Group>
  );
}
