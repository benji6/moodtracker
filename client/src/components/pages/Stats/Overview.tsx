import { Paper, Spinner } from "eri";
import GetStartedCta from "../../shared/GetStartedCta";
import Months from "./Months";
import Weeks from "./Weeks";
import {
  eventsHasLoadedFromServerSelector,
  hasMeditationsSelector,
  hasWeightsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import { useSelector } from "react-redux";
import Years from "./Years";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import { TEST_IDS } from "../../../constants";
import { Link } from "react-router-dom";

export default function Overview() {
  const eventsHasLoadedFromServer = useSelector(
    eventsHasLoadedFromServerSelector
  );
  const moods = useSelector(normalizedMoodsSelector);
  const hasMeditations = useSelector(hasMeditationsSelector);
  const hasWeights = useSelector(hasWeightsSelector);

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
        <h2>More</h2>
        <ul>
          {hasMeditations && (
            <li>
              <Link to="/meditation/stats">Meditation stats</Link>
            </li>
          )}
          {hasWeights && (
            <li>
              <Link to="/weight/stats">Weight stats</Link>
            </li>
          )}
          <li>
            <Link to="explore">Explore</Link>
          </li>
        </ul>
      </Paper>
    </Paper.Group>
  );
}
