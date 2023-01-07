import { useQuery } from "@tanstack/react-query";
import { Paper, Spinner } from "eri";
import { usageGet } from "../../../../api";
import { REPO_ISSUES_URL, WEEKDAY_LABELS_SHORT } from "../../../../constants";
import formatDurationFromSeconds from "../../../../formatters/formatDurationFromSeconds";
import {
  integerFormatter,
  percentFormatter,
} from "../../../../formatters/numberFormatters";
import { Usage } from "../../../../types";
import ColumnChart from "../../../shared/ColumnChart";
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
              ["Users over the last 30 days (active users)", data.MAUs],
              ["Confirmed users", data.confirmedUsers],
              [
                "New confirmed users over the last 30 days",
                data.last30Days.newUsers,
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
                <MoodCell mood={data.last30Days.meanMood} />,
              ],
              [
                "Total time meditated by all users over the last 30 days",
                formatDurationFromSeconds(data.last30Days.meditationSeconds),
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
                "Active users who have logged their location over the last 30 days",
                formatAsPercentageOfMaus(data.locationMAUs),
              ],
              [
                "Total events recorded over the last 30 days",
                data.last30Days.count,
              ],
            ]}
          />
          {data?.last28Days?.eventCountByWeekday && (
            <>
              <h3>Events by weekday</h3>
              <p>Based on the last 28 days.</p>
              <ColumnChart
                data={Object.entries(data.last28Days.eventCountByWeekday).map(
                  ([k, y]) => {
                    const label = WEEKDAY_LABELS_SHORT[Number(k)];
                    return {
                      y,
                      label,
                      key: k,
                      title: `${label}: ${integerFormatter.format(y)}`,
                    };
                  }
                )}
                rotateXLabels
                xAxisTitle="Weekday"
                yAxisTitle="Total events"
              />
            </>
          )}
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
