import { Paper, Spinner } from "eri";
import DeviceSetupDialog from "./DeviceSetupDialog";
import GetStartedCta from "../../shared/GetStartedCta";
import MoodList from "./MoodList";
import NotSignedIn from "./NotSignedIn";
import eventsSlice from "../../../store/eventsSlice";
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

  if (!userIsSignedIn) return <NotSignedIn />;

  return (
    <Paper.Group>
      {eventsHasLoadedFromServer ? (
        moods.allIds.length ? (
          <MoodList />
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
