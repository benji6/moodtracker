import { Paper, ShareButton, Spinner } from "eri";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usageGet } from "../../../api";
import {
  GH_USER_URL,
  MOODTRACKER_DESCRIPTION,
  REPO_ISSUES_URL,
  REPO_URL,
} from "../../../constants";
import formatDurationFromSeconds from "../../../formatters/formatDurationFromSeconds";
import { percentFormatter } from "../../../formatters/numberFormatters";
import { Usage } from "../../../types";
import MoodCell from "../../shared/MoodCell";
import Version from "../../shared/Version";
import UsageTable from "./UsageTable";

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

  const formatRetentionFunnelPercentage = (n: number): string =>
    usage ? percentFormatter.format(usage.MAUs ? n / usage.MAUs : 0) : "";

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
      <Paper>
        <h2>Usage</h2>
        {error ? (
          error === "SERVER_ERROR" ? (
            <p className="negative">
              Error fetching the latest usage statistics. Something has gone
              wrong on our side, if the problem persists feel free to{" "}
              <a href={REPO_ISSUES_URL} rel="noopener" target="_blank">
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
              In case you were interested in how other people are using
              MoodTracker you can see some anonymized usage data here. This gets
              automatically updated every day or so.
            </p>
            <h3>Active users</h3>
            <p>
              Confirmed users are users who have confirmed their email address.
            </p>
            <UsageTable
              data={[
                ["Users over the last 24 hours", usage.DAUs],
                ["Users over the last 7 days", usage.WAUs],
                ["Users over the last 30 days", usage.MAUs],
                ["Confirmed users", usage.confirmedUsers],
                [
                  "New confirmed users over the last 30 days",
                  usage.newUsersInLast30Days,
                ],
              ]}
            />
            <h3>Retention</h3>
            <p>
              Active users are users who have tracked at least one thing over
              the last 30 days.
            </p>
            <UsageTable
              data={[
                [
                  "Active users who joined less than 30 days ago",
                  formatRetentionFunnelPercentage(
                    usage.MAUFunnel["<7 days"] +
                      usage.MAUFunnel[">=7 & <30 days"]
                  ),
                ],
                [
                  "Active users who joined between 30 and 90 days ago",
                  formatRetentionFunnelPercentage(
                    usage.MAUFunnel[">=30 & <60 days"] +
                      usage.MAUFunnel[">=60 & <90 days"]
                  ),
                ],
                [
                  "Active users who joined between 90 and 365 days ago",
                  formatRetentionFunnelPercentage(
                    usage.MAUFunnel[">=90 & <365 days"]
                  ),
                ],
                [
                  "Active users who joined over a year ago",
                  formatRetentionFunnelPercentage(
                    usage.MAUFunnel[">=365 days"]
                  ),
                ],
                [
                  "Retention of users since a month ago",
                  percentFormatter.format(usage.CRR),
                ],
              ]}
            />
            <h3>General usage</h3>
            <UsageTable
              data={[
                [
                  "Average mood for all users over the last 7 days",
                  // eslint-disable-next-line react/jsx-key
                  <MoodCell mood={usage.meanMoodInLast7Days} />,
                ],
                [
                  "Average mood for all users over the last 30 days",
                  // eslint-disable-next-line react/jsx-key
                  <MoodCell mood={usage.meanMoodInLast30Days} />,
                ],
                [
                  "Total time meditated by all users over the last 30 days",
                  formatDurationFromSeconds(
                    usage.meditationSecondsInLast30Days
                  ),
                ],
                [
                  "Number of users who have logged a meditation over the last 30 days",
                  formatDurationFromSeconds(usage.meditationMAUs),
                ],
                [
                  "Number of users who have logged a weight over the last 30 days",
                  usage.weightMAUs,
                ],
                [
                  "Total events recorded over the last 30 days",
                  usage.eventsInLast30Days,
                ],
              ]}
            />
            <h3>Settings</h3>
            <UsageTable
              data={[
                [
                  "Users who are signed up to weekly emails",
                  usage.usersWithWeeklyEmails,
                ],
              ]}
            />
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
