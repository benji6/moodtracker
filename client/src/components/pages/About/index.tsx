import { Paper, ShareButton } from "eri";
import { Link } from "react-router-dom";
import {
  GH_USER_URL,
  MOODTRACKER_DESCRIPTION,
  REPO_ISSUES_URL,
  REPO_URL,
} from "../../../constants";
import Version from "../../shared/Version";

export default function About() {
  return (
    <Paper.Group>
      <Paper>
        <h2>About</h2>
        <p>{MOODTRACKER_DESCRIPTION}</p>
        <h3>Open source</h3>
        <p>
          You can find the source code{" "}
          <a href={REPO_URL} rel="noopener" target="_blank">
            here
          </a>{" "}
          and if you have any ideas 💡, feedback 🗣️ or bugs 🐛 you can raise
          them{" "}
          <a href={REPO_ISSUES_URL} rel="noopener" target="_blank">
            here
          </a>
          .
        </p>
        <p>
          The UI was put together using an open source component library I built
          called{" "}
          <a href={`${GH_USER_URL}/eri`} rel="noopener" target="_blank">
            Eri
          </a>
          .
        </p>
        <h3>Updates</h3>
        <Version />
        <p>
          Check out <Link to="/blog">our blog</Link> for major feature
          announcements.
        </p>
        <p>
          Check out the{" "}
          <a href={`${REPO_URL}/commits/master`} rel="noopener" target="_blank">
            commit log
          </a>{" "}
          for an overview of all source code changes.
        </p>
        <ShareButton />
      </Paper>
      <Paper>
        <h2>Business model</h2>
        <p>
          I started building MoodTracker in April 2020 because I couldn&apos;t
          find anything that worked in the way I wanted and because I enjoy
          making things.
        </p>
        <p>
          The app is currently free because there are very few active users,
          which means that it costs me very little to run. If this app gets very
          popular and starts costing a lot of money then I may explore revenue
          models, but that doesn&apos;t seem like it will happen any time soon,
          so for now I&apos;m very happy to share this experience for free.
        </p>
        <p>
          I hope that those of you who are using it are enjoying it and finding
          it useful! 🙂
        </p>
      </Paper>
      <Paper>
        <h2>Acknowledgements</h2>
        <ul>
          <li>
            Open source icons from{" "}
            <a href="https://feathericons.com" rel="noopener" target="_blank">
              Feather
            </a>{" "}
            (MIT),{" "}
            <a href="https://tabler-icons.io" rel="noopener" target="_blank">
              tabler icons
            </a>{" "}
            (MIT) &{" "}
            <a href="https://iconoir.com" rel="noopener" target="_blank">
              iconoir
            </a>{" "}
            (MIT)
          </li>
          <li>
            Open source meditation bell from{" "}
            <a
              href="https://freesound.org/people/fauxpress/sounds/42095"
              rel="noopener"
              target="_blank"
            >
              Freesound
            </a>{" "}
            (CC0 1.0)
          </li>
          <li>
            A lot of open source software projects (
            <a href={REPO_URL} rel="noopener" target="_blank">
              see GitHub for details
            </a>
            )
          </li>
        </ul>
      </Paper>
    </Paper.Group>
  );
}
