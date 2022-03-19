import { Paper } from "eri";
import { useSelector } from "react-redux";
import { normalizedMeditationsSelector } from "../../../../selectors";
import RedirectHome from "../../RedirectHome";
import MeditationLog from "./MeditationLog";
import MeditationStats from "./MeditationStats";

export default function Meditation() {
  const meditations = useSelector(normalizedMeditationsSelector);

  if (!meditations.allIds.length) return <RedirectHome />;

  return (
    <Paper.Group>
      <Paper>
        <h2>Meditation stats</h2>
      </Paper>
      <MeditationStats />
      <MeditationLog />
    </Paper.Group>
  );
}
