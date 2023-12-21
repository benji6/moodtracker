import { Paper, Spinner } from "eri";
import MoodList from "./MoodList";
import GetStartedCta from "../../shared/GetStartedCta";
import { useSelector } from "react-redux";
import NotSignedIn from "./NotSignedIn";
import DeviceSetupDialog from "./DeviceSetupDialog";
import userSlice from "../../../store/userSlice";
import eventsSlice from "../../../store/eventsSlice";

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
