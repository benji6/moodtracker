import { Paper, Spinner } from "eri";
import MoodList from "./MoodList";
import GetStartedCta from "../../shared/GetStartedCta";
import { useSelector } from "react-redux";
import {
  eventsSelector,
  normalizedMoodsSelector,
  userIsSignedInSelector,
} from "../../../selectors";
import NotSignedIn from "./NotSignedIn";
import DeviceSetupDialog from "./DeviceSetupDialog";

export interface HomeState {
  dayCount: number | undefined;
  page: number;
}

export default function Home() {
  const events = useSelector(eventsSelector);
  const moods = useSelector(normalizedMoodsSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);

  if (!userIsSignedIn) return <NotSignedIn />;

  return (
    <Paper.Group>
      {events.hasLoadedFromServer ? (
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
