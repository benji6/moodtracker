import { RouteComponentProps } from "@reach/router";
import { Paper, SubHeading } from "eri";
import * as React from "react";
import { dateFormatter } from "../../../dateTimeFormatters";

const BLOG_POSTS = {
  "2021-07-02": {
    __html: require("./2021-07-02"),
    title: "New feature - meditation log",
  },
  "2021-04-25": {
    __html: require("./2021-04-25"),
    title: "New feature - daily statistics",
  },
  "2021-04-18": {
    __html: require("./2021-04-18"),
    title: "New feature - meditation timer",
  },
  "2021-04-04": {
    __html: require("./2021-04-04"),
    title: "New feature - mood gradient visualization",
  },
  "2021-03-18": {
    __html: require("./2021-03-18"),
    title: "New feature - weekly email updates",
  },
  "2021-02-19": {
    __html: require("./2021-02-19"),
    title: "Average mood by hour",
  },
  "2021-02-17": {
    __html: require("./2021-02-17"),
    title: "Improvements to the explore page",
  },
  "2021-01-23": {
    __html: require("./2021-01-23"),
    title: "New feature - search and filter",
  },
  "2021-01-14": {
    __html: require("./2021-01-14"),
    title: "New feature - data export",
  },
  "2021-01-12": {
    __html: require("./2021-01-12"),
    title: "Yearly statistics and other improvements to stats",
  },
  "2021-01-09": {
    __html: require("./2021-01-09"),
    title: "New feature - date controls on explore page",
  },
  "2021-01-01": {
    __html: require("./2021-01-01"),
    title: "New feature - calendar view",
  },
  "2020-12-30": {
    __html: require("./2020-12-30"),
    title: "New feature - exploration",
  },
};

export default function Blog(_: RouteComponentProps) {
  return (
    <Paper.Group>
      <Paper>
        <h2>Blog</h2>
        <p>Welcome to the MoodTracker blog!</p>
        <p>
          This space is for announcing interesting new features and
          developments. Less exciting stuff like bugfixes, performance
          improvements and minor UI changes won&apos;t get a mention here.
        </p>
      </Paper>
      {Object.entries(BLOG_POSTS).map(([dateString, { __html, title }]) => (
        <Paper key={dateString}>
          <article itemScope itemType="http://schema.org/BlogPosting">
            <h2>
              {title}
              <SubHeading>
                <time
                  dateTime={dateString}
                  itemProp="dateCreated datePublished pubdate"
                >
                  {dateFormatter.format(new Date(dateString))}
                </time>
              </SubHeading>
            </h2>
            <div dangerouslySetInnerHTML={{ __html }} />
          </article>
        </Paper>
      ))}
    </Paper.Group>
  );
}
