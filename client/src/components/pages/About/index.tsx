import { Paper, ShareButton } from "eri";
import { Link } from "react-router-dom";
import {
  GH_USER_URL,
  MOODTRACKER_DESCRIPTION,
  REPO_ISSUES_URL,
  REPO_URL,
} from "../../../constants";
import Version from "../../shared/Version";
import Usage from "./Usage";

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
        <h2>Privacy policy</h2>
        <h3>Tl;dr</h3>
        <p>
          This project is{" "}
          <a href={REPO_URL} rel="noopener" target="_blank">
            open source
          </a>{" "}
          so we are totally transparent about how we store your data securely.
          Further to this, we do not sell or share any of your data with anyone.
        </p>
        <h3>What we collect and why</h3>
        <p>
          We collect the minimum data required for the app to function. That
          means we take your email address when you sign up and we collect all
          the data you submit while using the app.
        </p>
        <p>
          We also collect data on errors and crashes that we send to a{" "}
          <a href="https://sentry.io" rel="noopener" target="_blank">
            3rd party development tool
          </a>
          . This typically does not include any user data.
        </p>
        <h3>Information we do not collect</h3>
        <p>
          We do not collect any data that is unnecessary for running the app, we
          do not collect any data you have not submitted to us, we do not use
          cookies and we do not run any 3rd party analytics.
        </p>
        <h3>Changes</h3>
        <p>
          We may update this policy in the future if regulations or practices
          change. Because the project is open source you can view the history of
          this policy{" "}
          <a href={REPO_URL} rel="noopener" target="_blank">
            on GitHub
          </a>
          . We will announce any significant policy changes on{" "}
          <Link to="/blog">our blog</Link>.
        </p>
        <h3>Questions</h3>
        <p>
          If you have any questions or feedback on this policy then please feel
          free to{" "}
          <a href={REPO_ISSUES_URL} rel="noopener" target="_blank">
            raise an issue on GitHub
          </a>
          .
        </p>
      </Paper>
      <Usage />
      <Paper>
        <h2>Acknowledgements</h2>
        <ul>
          <li>
            Open source icons from{" "}
            <a href="https://feathericons.com" rel="noopener" target="_blank">
              Feather
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
