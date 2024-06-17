import { Paper, Spinner } from "eri";
import { formatIsoDateInLocalTimezone, roundDateDown } from "../../../utils";
import DeviceSetupDialog from "./DeviceSetupDialog";
import GetStartedCta from "../../shared/GetStartedCta";
import { Link } from "react-router-dom";
import NotSignedIn from "./NotSignedIn";
import { QuickTrackNav } from "./QuickTrackNav";
import SummaryForWeek from "../Stats/SummaryForWeek";
import TrackedCategoriesByDay from "./TrackedCategoriesByDay";
import { WEEK_OPTIONS } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { startOfWeek } from "date-fns";
import { useSelector } from "react-redux";
import userSlice from "../../../store/userSlice";

export interface HomeState {
  dayCount: number | undefined;
  page: number;
}

export default function Home() {
  const eventsHasLoadedFromServer = useSelector(
    eventsSlice.selectors.hasLoadedFromServer,
  );
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
  const userIsSignedIn = useSelector(userSlice.selectors.isSignedIn);
  const dateToday = roundDateDown(new Date());

  if (!userIsSignedIn) return <NotSignedIn />;

  return (
    <Paper.Group>
      {eventsHasLoadedFromServer ? (
        moods.allIds.length ? (
          <>
            <QuickTrackNav />
            <SummaryForWeek
              heading={
                <Link
                  to={`/stats/weeks/${formatIsoDateInLocalTimezone(
                    startOfWeek(dateToday, WEEK_OPTIONS),
                  )}`}
                >
                  This week&apos;s summary
                </Link>
              }
              date={dateToday}
            />
            <TrackedCategoriesByDay />
          </>
        ) : (
          <GetStartedCta />
        )
      ) : (
        <Spinner />
      )}
      <DeviceSetupDialog />
    </Paper.Group>
  );
}
