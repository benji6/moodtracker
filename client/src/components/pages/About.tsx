import { Paper, ShareButton, Spinner } from "eri";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usageGet } from "../../api";
import { MOODTRACKER_DESCRIPTION } from "../../constants";
import { percentFormatter } from "../../numberFormatters";
import { Usage } from "../../types";
import Version from "../shared/Version";

export default function About() {
  const [usage, setUsage] = useState<Usage | undefined>();
  const [error, setError] = useState<
    "NETWORK_ERROR" | "SERVER_ERROR" | undefined
  >();

  useEffect(() => {
    usageGet().then(
      (usage) => {
        setUsage(usage);
        if (error) setError(undefined);
      },
      (e: Error) => {
        setError(e.message === "500" ? "SERVER_ERROR" : "NETWORK_ERROR");
      }
    );
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper.Group>
      <Paper>
        <h2>About</h2>
        <p>{MOODTRACKER_DESCRIPTION}</p>
        <h3>Open source</h3>
        <p>
          You can find the source code{" "}
          <a
            href="https://github.com/benji6/moodtracker"
            rel="noopener"
            target="_blank"
          >
            here
          </a>{" "}
          and if you have any ideas 💡, feedback 🗣️ or bugs 🐛 you can raise
          them{" "}
          <a
            href="https://github.com/benji6/moodtracker/issues"
            rel="noopener"
            target="_blank"
          >
            here
          </a>
          .
        </p>
        <p>
          The UI was put together using an open source component library I built
          called{" "}
          <a
            href="https://github.com/benji6/eri"
            rel="noopener"
            target="_blank"
          >
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
          <a
            href="https://github.com/benji6/moodtracker"
            rel="noopener"
            target="_blank"
          >
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
          <a
            href="https://github.com/benji6/moodtracker"
            rel="noopener"
            target="_blank"
          >
            on GitHub
          </a>
          . We will announce any significant policy changes on{" "}
          <Link to="/blog">our blog</Link>.
        </p>
        <h3>Questions</h3>
        <p>
          If you have any questions or feedback on this policy then please feel
          free to{" "}
          <a
            href="https://github.com/benji6/moodtracker/issues"
            rel="noopener"
            target="_blank"
          >
            raise an issue on GitHub
          </a>
          .
        </p>
      </Paper>
      <Paper>
        <h2>Usage</h2>
        {error ? (
          error === "SERVER_ERROR" ? (
            <p className="negative">
              Error fetching the latest usage statistics. Something has gone
              wrong on our side, if the problem persists feel free to{" "}
              <a
                href="https://github.com/benji6/moodtracker/issues"
                rel="noopener"
                target="_blank"
              >
                raise an issue on GitHub
              </a>
              .
            </p>
          ) : (
            <p className="negative">
              Error fetching the latest usage statistics. You need an internet
              connection to fetch this data, please check and try refreshing.
            </p>
          )
        ) : usage ? (
          <>
            <p>
              In case you were interested in how many other people are using
              MoodTracker you can see some anonymized usage data here. This gets
              automatically updated every day or so.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Users over the last 24 hours</td>
                  <td>{usage.DAUs}</td>
                </tr>
                <tr>
                  <td>Users over the last 7 days</td>
                  <td>{usage.WAUs}</td>
                </tr>
                <tr>
                  <td>Users over the last 30 days</td>
                  <td>{usage.MAUs}</td>
                </tr>
                <tr>
                  <td>Users who are signed up to weekly emails</td>
                  <td>{usage.usersWithWeeklyEmails}</td>
                </tr>
                <tr>
                  <td>Confirmed users</td>
                  <td>{usage.confirmedUsers}</td>
                </tr>
                <tr>
                  <td>Retention of users since a month ago</td>
                  <td>{percentFormatter.format(usage.CRR)}</td>
                </tr>
                <tr>
                  <td>
                    Users who have logged a meditation over the last 30 days
                  </td>
                  <td>{usage.meditationMAUs}</td>
                </tr>
                <tr>
                  <td>Users who are recording their location</td>
                  <td>{usage.usersWithLocation}</td>
                </tr>
                <tr>
                  <td>Total events recorded over the last 30 days</td>
                  <td>{usage.eventsInLast30Days}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <p>
            <Spinner inline margin="end" />
            Fetching the latest stats...
          </p>
        )}
      </Paper>
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
            <a
              href="https://github.com/benji6/moodtracker"
              rel="noopener"
              target="_blank"
            >
              see GitHub for details
            </a>
            )
          </li>
        </ul>
      </Paper>
    </Paper.Group>
  );
}
