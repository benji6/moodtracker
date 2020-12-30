import { RouteComponentProps } from "@reach/router";
import { Paper, SubHeading } from "eri";
import * as React from "react";
import { dateFormatter } from "../../../formatters";

const BLOG_POSTS = { "2020-12-30": require("./2020-12-30") };

export default function Blog(_: RouteComponentProps) {
  return (
    <Paper.Group>
      <Paper>
        <h2>Blog</h2>
      </Paper>
      {Object.entries(BLOG_POSTS).map(([dateString, __html]) => (
        <Paper key={dateString}>
          <article itemScope itemType="http://schema.org/BlogPosting">
            <h2>
              New feature - exploration
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
