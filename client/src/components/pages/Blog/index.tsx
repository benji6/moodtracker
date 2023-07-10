import { Paper, Spinner, SubHeading } from "eri";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { dateFormatter } from "../../../formatters/dateTimeFormatters";
import Version from "../../shared/Version";

const BLOG_POSTS = {
  "2023-04-02": {
    imageUrls: [new URL("2023-04-02/screenshot.png?as=avif", import.meta.url)],
    title: "Location place names",
    url: new URL("2023-04-02/index.md", import.meta.url),
  },
  "2023-01-02": {
    imageUrls: [
      new URL("2023-01-02/screenshot-1.png?as=avif", import.meta.url),
      new URL("2023-01-02/screenshot-2.png?as=avif", import.meta.url),
    ],
    title: "Enhancements to Explore page",
    url: new URL("2023-01-02/index.md", import.meta.url),
  },
  "2022-12-28": {
    imageUrls: [
      new URL("2022-12-28/screenshot-1.png?as=avif", import.meta.url),
      new URL("2022-12-28/screenshot-2.png?as=avif", import.meta.url),
    ],
    title: "New weather features",
    url: new URL("2022-12-28/index.md", import.meta.url),
  },
  "2022-11-01": {
    imageUrls: [
      new URL("2022-11-01/screenshot-1.png?as=avif", import.meta.url),
      new URL("2022-11-01/screenshot-2.png?as=avif", import.meta.url),
    ],
    title: "Improvements to stats pages",
    url: new URL("2022-11-01/index.md", import.meta.url),
  },
  "2022-05-22": {
    imageUrls: [
      new URL("2022-05-22/screenshot-1.png?as=avif", import.meta.url),
      new URL("2022-05-22/screenshot-2.png?as=avif", import.meta.url),
    ],
    title: "Improvements to stats pages",
    url: new URL("2022-05-22/index.md", import.meta.url),
  },
  "2022-02-13": {
    imageUrls: [new URL("2022-02-13/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - location map",
    url: new URL("2022-02-13/index.md", import.meta.url),
  },
  "2022-01-13": {
    imageUrls: [new URL("2022-01-13/screenshot.png?as=avif", import.meta.url)],
    title: "Mood chart added to day stats view",
    url: new URL("2022-01-13/index.md", import.meta.url),
  },
  "2021-12-15": {
    imageUrls: [
      new URL("2021-12-15/screenshot-1.png?as=avif", import.meta.url),
      new URL("2021-12-15/screenshot-2.png?as=avif", import.meta.url),
    ],
    title: "Updates to summary view on stats pages",
    url: new URL("2021-12-15/index.md", import.meta.url),
  },
  "2021-09-24": {
    imageUrls: [new URL("2021-09-24/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - record your location",
    url: new URL("2021-09-24/index.md", import.meta.url),
  },
  "2021-07-17": {
    imageUrls: [new URL("2021-07-17/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - open-ended meditation",
    url: new URL("2021-07-17/index.md", import.meta.url),
  },
  "2021-07-15": {
    title: "New feature - meditation stats page",
    url: new URL("2021-07-15/index.md", import.meta.url),
  },
  "2021-07-02": {
    imageUrls: [
      new URL("2021-07-02/screenshot-1.png?as=avif", import.meta.url),
      new URL("2021-07-02/screenshot-2.png?as=avif", import.meta.url),
    ],
    title: "New feature - meditation log",
    url: new URL("2021-07-02/index.md", import.meta.url),
  },
  "2021-04-25": {
    title: "New feature - daily statistics",
    url: new URL("2021-04-25/index.md", import.meta.url),
  },
  "2021-04-18": {
    imageUrls: [new URL("2021-04-18/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - meditation timer",
    url: new URL("2021-04-18/index.md", import.meta.url),
  },
  "2021-04-04": {
    imageUrls: [
      new URL("2021-04-04/screenshot-1.png?as=avif", import.meta.url),
      new URL("2021-04-04/screenshot-2.png?as=avif", import.meta.url),
    ],
    title: "New feature - mood gradient visualization",
    url: new URL("2021-04-04/index.md", import.meta.url),
  },
  "2021-03-18": {
    imageUrls: [new URL("2021-03-18/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - weekly email updates",
    url: new URL("2021-03-18/index.md", import.meta.url),
  },
  "2021-02-19": {
    imageUrls: [new URL("2021-02-19/screenshot.png?as=avif", import.meta.url)],
    title: "Average mood by hour",
    url: new URL("2021-02-19/index.md", import.meta.url),
  },
  "2021-02-17": {
    title: "Improvements to the explore page",
    url: new URL("2021-02-17/index.md", import.meta.url),
  },
  "2021-01-23": {
    imageUrls: [new URL("2021-01-23/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - search and filter",
    url: new URL("2021-01-23/index.md", import.meta.url),
  },
  "2021-01-14": {
    imageUrls: [new URL("2021-01-14/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - data export",
    url: new URL("2021-01-14/index.md", import.meta.url),
  },
  "2021-01-12": {
    imageUrls: [new URL("2021-01-12/screenshot.png?as=avif", import.meta.url)],
    title: "Yearly statistics and other improvements to stats",
    url: new URL("2021-01-12/index.md", import.meta.url),
  },
  "2021-01-09": {
    imageUrls: [new URL("2021-01-09/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - date controls on explore page",
    url: new URL("2021-01-09/index.md", import.meta.url),
  },
  "2021-01-01": {
    imageUrls: [new URL("2021-01-01/screenshot.png?as=avif", import.meta.url)],
    title: "New feature - calendar view",
    url: new URL("2021-01-01/index.md", import.meta.url),
  },
  "2020-12-30": {
    imageUrls: [
      new URL("2020-12-30/screenshot-1.png?as=avif", import.meta.url),
      new URL("2020-12-30/screenshot-2.png?as=avif", import.meta.url),
    ],
    title: "New feature - exploration",
    url: new URL("2020-12-30/index.md", import.meta.url),
  },
} as const;

export default function Blog() {
  const [posts, setPosts] = useState<
    { __html: string; dateString: string; title: string }[]
  >([]);
  useEffect(() => {
    Promise.all(
      Object.entries(BLOG_POSTS).map(async ([dateString, post]) => {
        const response = await fetch(String(post.url));
        let text = await response.text();
        if ("imageUrls" in post)
          for (const { pathname } of post.imageUrls)
            text = text.replace(
              pathname.slice(1).replace(/\..+\.avif$/, ".png"),
              pathname,
            );
        const __html = marked.parse(text);
        return { __html, dateString, title: post.title };
      }),
    ).then(setPosts);
  }, []);

  return (
    <Paper.Group>
      <Paper>
        <h2>Blog</h2>
        <p>Welcome to the MoodTracker blog!</p>
        <p>
          This space is for announcing interesting new features and
          developments.
        </p>
        <p>
          Less exciting stuff like bugfixes, performance improvements and minor
          UI changes won&apos;t get a mention here (if you&apos;re interested
          though you can see a{" "}
          <a
            href="https://github.com/benji6/moodtracker/commits/master"
            rel="noopener"
            target="blank"
          >
            full technical changelog on GitHub
          </a>
          ).
        </p>
        <Version />
      </Paper>
      {posts.length ? (
        posts.map(({ __html, dateString, title }) => (
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
        ))
      ) : (
        <div>
          <Spinner />
        </div>
      )}
    </Paper.Group>
  );
}
