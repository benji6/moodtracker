import { Paper, Spinner } from "eri";
import GetStartedCta from "../../shared/GetStartedCta";
import Months from "./Months";
import Weeks from "./Weeks";
import { useSelector } from "react-redux";
import Years from "./Years";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import { TEST_IDS } from "../../../constants";
import { Link } from "react-router-dom";
import eventsSlice from "../../../store/eventsSlice";

export default function Overview() {
  const eventsHasLoadedFromServer = useSelector(
    eventsSlice.selectors.hasLoadedFromServer,
  );
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);

  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <GetStartedCta />
      </Paper.Group>
    );

  if (!eventsHasLoadedFromServer) return <Spinner />;

  return (
    <Paper.Group data-test-id={TEST_IDS.statsOverviewPage}>
      <Paper>
        <h2>Overview</h2>
        <MoodGradientForPeriod
          dateFrom={new Date(moods.allIds[0])}
          dateTo={new Date(moods.allIds.at(-1)!)}
        />
      </Paper>
      <Weeks />
      <Months />
      <Years />
      <Paper>
        <h2 className="center">
          <Link to="explore">Explore</Link>
        </h2>
      </Paper>
    </Paper.Group>
  );
}
