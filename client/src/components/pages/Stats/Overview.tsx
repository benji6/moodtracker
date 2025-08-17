import { Paper, Spinner } from "eri";
import GetStartedCta from "../../shared/GetStartedCta";
import { Link } from "react-router";
import Months from "./Months";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import { TEST_IDS } from "../../../constants";
import Weeks from "./Weeks";
import Years from "./Years";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function Overview() {
  const eventsHasLoadedFromServer = useSelector(
    eventsSlice.selectors.hasLoadedFromServer,
  );
  const denormalizedMoodsOrderedByExperiencedAt = useSelector(
    eventsSlice.selectors.denormalizedMoodsOrderedByExperiencedAt,
  );

  if (!denormalizedMoodsOrderedByExperiencedAt.length)
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
          dateFrom={
            new Date(denormalizedMoodsOrderedByExperiencedAt[0].experiencedAt)
          }
          dateTo={
            new Date(
              denormalizedMoodsOrderedByExperiencedAt[
                denormalizedMoodsOrderedByExperiencedAt.length - 1
              ].experiencedAt,
            )
          }
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
