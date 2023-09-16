import { useQuery } from "@tanstack/react-query";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import subDays from "date-fns/subDays";
import { Chart, Paper, Spinner, SubHeading } from "eri";
import { usageGet } from "../../../../api";
import { REPO_ISSUES_URL, WEEKDAY_LABELS_SHORT } from "../../../../constants";
import { monthYearShortFormatter } from "../../../../formatters/dateTimeFormatters";
import formatDurationFromSeconds from "../../../../formatters/formatDurationFromSeconds";
import {
  integerFormatter,
  percentFormatter,
} from "../../../../formatters/numberFormatters";
import { Usage } from "../../../../types";
import MoodCell from "../../../shared/MoodCell";
import UsageTable from "./UsageTable";

export default function Usage() {
  const { data, error, isError, isLoading } = useQuery(["usage"], usageGet, {
    networkMode: "offlineFirst",
  });

  const formatAsPercentageOfMaus = (n: number): string =>
    data
      ? percentFormatter.format(data.usage.MAUs ? n / data.usage.MAUs : 0)
      : "";

  const usersByJoinDateColumnChartData = [
    { label: "Less than 7 days ago", key: "<7 days" },
    { label: "Between 7 and 30 days ago", key: ">=7 & <30 days" },
    { label: "Between 30 and 60 days ago", key: ">=30 & <60 days" },
    { label: "Between 60 and 90 days ago", key: ">=60 & <90 days" },
    { label: "Between 90 and 365 days ago", key: ">=90 & <365 days" },
    { label: "More than a year ago", key: ">=365 days" },
  ] as const;

  if (data === undefined || !("expires" in data) || !("usage" in data)) return;

  const titleEl = <h2>Usage</h2>;

  if (isLoading)
    return (
      <Paper.Group>
        <Paper>
          {titleEl}
          <p>
            <Spinner inline margin="end" />
            Fetching the latest stats...
          </p>
        </Paper>
      </Paper.Group>
    );

  if (isError)
    return (
      <Paper.Group>
        <Paper>
          {titleEl}
          {error instanceof Error && error.message === "500" ? (
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
          )}
        </Paper>
      </Paper.Group>
    );

  return (
    <Paper.Group>
      <Paper>
        {titleEl}
        <p>
          In case you were interested in how other people are using MoodTracker
          you can see some anonymized usage data here. This gets automatically
          updated every day or so and was last updated{" "}
          <b>{formatDistanceToNow(subDays(data.expires, 1))} ago</b>.
        </p>
        <p>
          In the below statistics, active users are defined as users who have
          tracked at least one thing over the last 30 days.
        </p>
      </Paper>
      <Paper>
        <h3>Users by period last active</h3>
        <Chart.ColumnChart
          data={(
            [
              { key: "DAUs", label: "Within last 24 hours" },
              { key: "WAUs", label: "Within last 7 days" },
              {
                key: "MAUs",
                label: "Within last 30 days",
              },
            ] as const
          ).map(({ key, label }) => ({
            label,
            key,
            y: data.usage[key],
            title: `${data.usage[key]} user${data.usage[key] > 1 ? "s" : ""}`,
          }))}
          rotateXLabels
          xAxisTitle="Last active"
          yAxisTitle="User count"
        />
      </Paper>
      <Paper>
        <h3>Active users by join date</h3>
        <Chart.ColumnChart
          data={usersByJoinDateColumnChartData.map(({ key, label }) => ({
            label,
            key,
            y: data.usage.MAUFunnel[key],
            title: formatAsPercentageOfMaus(data.usage.MAUFunnel[key]),
          }))}
          rotateXLabels
          xAxisTitle="Join date"
          yAxisTitle="Active user count"
        />
      </Paper>
      {data.usage.byMonth && (
        <Paper>
          <h3>New users</h3>
          <h4>Confirmed users</h4>
          <p>
            Confirmed users are users who create an account and confirm their
            email address.
          </p>
          <Chart.ColumnChart
            data={Object.entries(data.usage.byMonth)
              .map(([k, v]) => {
                const y = v.users.confirmed;
                return {
                  key: k,
                  label: monthYearShortFormatter.format(new Date(k)),
                  y,
                  title: `${k}: ${integerFormatter.format(
                    y,
                  )} new confirmed user${y === 1 ? "" : "s"}`,
                };
              })
              .sort((a, b) => a.key.localeCompare(b.key))
              .slice(-12)}
            rotateXLabels
            xAxisTitle="Month"
            yAxisTitle="New confirmed users"
          />
          <h4>Unconfirmed users</h4>
          <p>
            Unconfirmed users are users who create an account but do not confirm
            their email address. They cannot use MoodTracker.
          </p>
          <Chart.ColumnChart
            data={Object.entries(data.usage.byMonth)
              .map(([k, v]) => {
                const y = v.users.unconfirmed;
                return {
                  key: k,
                  label: monthYearShortFormatter.format(new Date(k)),
                  y,
                  title: `${k}: ${integerFormatter.format(
                    y,
                  )} new unconfirmed user${y === 1 ? "" : "s"}`,
                };
              })
              .sort((a, b) => a.key.localeCompare(b.key))
              .slice(-12)}
            rotateXLabels
            xAxisTitle="Month"
            yAxisTitle="New unconfirmed users"
          />
        </Paper>
      )}
      {data?.usage?.last28Days?.eventCountByWeekday && (
        <Paper>
          <h3>
            Average number of events by weekday
            <SubHeading>Based on the last 28 days</SubHeading>
          </h3>
          <Chart.ColumnChart
            data={Object.entries(data.usage.last28Days.eventCountByWeekday).map(
              ([k, count]) => {
                const label = WEEKDAY_LABELS_SHORT[Number(k)];
                const y = Math.round(count / 4);
                return {
                  y,
                  label,
                  key: k,
                  title: `${label}: ${integerFormatter.format(y)}`,
                };
              },
            )}
            rotateXLabels
            xAxisTitle="Weekday"
            yAxisTitle="Total events"
          />
        </Paper>
      )}
      <Paper>
        <h3>Miscellaneous usage stats</h3>
        <UsageTable
          data={[
            [
              "Average mood for all users over the last 7 days",
              // eslint-disable-next-line react/jsx-key
              <MoodCell mood={data.usage.meanMoodInLast7Days} />,
            ],
            [
              "Average mood for all users over the last 30 days",
              // eslint-disable-next-line react/jsx-key
              <MoodCell mood={data.usage.last30Days.meanMood} />,
            ],
            [
              "Total time meditated by all users over the last 30 days",
              formatDurationFromSeconds(
                data.usage.last30Days.meditationSeconds,
              ),
            ],
            [
              "Total events recorded over the last 30 days",
              data.usage.last30Days.eventCount,
            ],
          ]}
        />
      </Paper>
      <Paper>
        <h3>Miscellaneous user stats</h3>
        <UsageTable
          data={[
            [
              "Retention of users since a month ago",
              percentFormatter.format(data.usage.CRR),
            ],
            [
              "Number of devices with push notifications enabled",
              data.usage.totalWebPushTokens,
            ],
            [
              "Users who are signed up to weekly emails",
              data.usage.usersWithWeeklyEmails,
            ],
            [
              "Active users who have logged a meditation over the last 30 days",
              formatAsPercentageOfMaus(data.usage.meditationMAUs),
            ],
            [
              "Active users who have logged a weight over the last 30 days",
              formatAsPercentageOfMaus(data.usage.weightMAUs),
            ],
            [
              "Active users who have logged their location over the last 30 days",
              formatAsPercentageOfMaus(data.usage.locationMAUs),
            ],
            ["Total confirmed users", data.usage.confirmedUsers],
          ]}
        />
      </Paper>
    </Paper.Group>
  );
}
