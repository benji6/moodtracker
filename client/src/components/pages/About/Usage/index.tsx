import { useQuery } from "@tanstack/react-query";
import { Paper, Spinner } from "eri";
import { usageGet } from "../../../../api";
import { REPO_ISSUES_URL } from "../../../../constants";
import formatDurationFromSeconds from "../../../../formatters/formatDurationFromSeconds";
import { percentFormatter } from "../../../../formatters/numberFormatters";
import { Usage } from "../../../../types";
import MoodCell from "../../../shared/MoodCell";
import UsageTable from "./UsageTable";

export default function Usage() {
  const { data, error, isError, isLoading } = useQuery(["usage"], usageGet, {
    networkMode: "offlineFirst",
  });

  const formatAsPercentageOfMaus = (n: number): string =>
    data ? percentFormatter.format(data.MAUs ? n / data.MAUs : 0) : "";

  return (
    <Paper>
      <h2>Usage</h2>
      {isLoading ? (
        <p>
          <Spinner inline margin="end" />
          Fetching the latest stats...
        </p>
      ) : isError ? (
        error instanceof Error && error.message === "500" ? (
          <p className="negative">
            Error fetching the latest usage statistics. Something has gone wrong
            on our side, if the problem persists feel free to{" "}
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
      ) : (
        <>
          <p>
            In case you were interested in how other people are using
            MoodTracker you can see some anonymized usage data here. This gets
            automatically updated every day or so.
          </p>
          <p>
            In the below statistics, active users are defined as users who have
            tracked at least one thing over the last 30 days.
          </p>
          <h3>Active users</h3>
          <p>
            Confirmed users are users who have confirmed their email address.
          </p>
          <UsageTable
            data={[
              ["Users over the last 24 hours", data.DAUs],
              ["Users over the last 7 days", data.WAUs],
              ["Users over the last 30 days", data.MAUs],
              ["Confirmed users", data.confirmedUsers],
              [
                "New confirmed users over the last 30 days",
                data.newUsersInLast30Days,
              ],
            ]}
          />
          <h3>Retention</h3>
          <UsageTable
            data={[
              [
                "Active users who joined less than 30 days ago",
                formatAsPercentageOfMaus(
                  data.MAUFunnel["<7 days"] + data.MAUFunnel[">=7 & <30 days"]
                ),
              ],
              [
                "Active users who joined between 30 and 90 days ago",
                formatAsPercentageOfMaus(
                  data.MAUFunnel[">=30 & <60 days"] +
                    data.MAUFunnel[">=60 & <90 days"]
                ),
              ],
              [
                "Active users who joined between 90 and 365 days ago",
                formatAsPercentageOfMaus(data.MAUFunnel[">=90 & <365 days"]),
              ],
              [
                "Active users who joined over a year ago",
                formatAsPercentageOfMaus(data.MAUFunnel[">=365 days"]),
              ],
              [
                "Retention of users since a month ago",
                percentFormatter.format(data.CRR),
              ],
            ]}
          />
          <h3>General usage</h3>
          <UsageTable
            data={[
              [
                "Average mood for all users over the last 7 days",
                // eslint-disable-next-line react/jsx-key
                <MoodCell mood={data.meanMoodInLast7Days} />,
              ],
              [
                "Average mood for all users over the last 30 days",
                // eslint-disable-next-line react/jsx-key
                <MoodCell mood={data.meanMoodInLast30Days} />,
              ],
              [
                "Total time meditated by all users over the last 30 days",
                formatDurationFromSeconds(data.meditationSecondsInLast30Days),
              ],
              [
                "Active users who have logged a meditation over the last 30 days",
                formatAsPercentageOfMaus(data.meditationMAUs),
              ],
              [
                "Active users who have logged a weight over the last 30 days",
                formatAsPercentageOfMaus(data.weightMAUs),
              ],
              [
                "Total events recorded over the last 30 days",
                data.eventsInLast30Days,
              ],
            ]}
          />
          <h3>Settings</h3>
          <UsageTable
            data={[
              [
                "Users who are signed up to weekly emails",
                data.usersWithWeeklyEmails,
              ],
            ]}
          />
        </>
      )}
    </Paper>
  );
}
