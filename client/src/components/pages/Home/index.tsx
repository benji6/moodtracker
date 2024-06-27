import { Paper, Spinner } from "eri";
import Events from "./Events";
import GetStartedCta from "../../shared/GetStartedCta";
import NotSignedIn from "./NotSignedIn";
import { QuickTrackNav } from "./QuickTrackNav";
import ReviewSettingsDialog from "./ReviewSettingsDialog";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import userSlice from "../../../store/userSlice";

export default function Home() {
  const eventsHasLoadedFromServer = useSelector(
    eventsSlice.selectors.hasLoadedFromServer,
  );
  const { allIds } = useSelector(
    eventsSlice.selectors.allNormalizedTrackedCategories,
  );
  const userIsSignedIn = useSelector(userSlice.selectors.isSignedIn);

  if (!userIsSignedIn) return <NotSignedIn />;

  return (
    <Paper.Group>
      {eventsHasLoadedFromServer ? (
        <>
          <QuickTrackNav />
          {allIds.length ? <Events /> : <GetStartedCta />}
        </>
      ) : (
        <Spinner />
      )}
      <ReviewSettingsDialog />
    </Paper.Group>
  );
}
