import { RouteComponentProps } from "@reach/router";
import { Paper, ShareButton } from "eri";
import * as React from "react";

export default function SeeAlso(_: RouteComponentProps) {
  return (
    <Paper.Group>
      <Paper>
        <h2>See also</h2>
        <p>These are some other web apps that I've built:</p>
        <ul>
          <li>
            <a
              href="https://meditation-timer.org"
              rel="noopener"
              target="_blank"
            >
              Meditate
            </a>{" "}
            is a free and open source web app that allows you to time your
            meditations. It's simple to use, works offline and aims to be the
            perfect aide for your meditation practice!
          </li>
          <li>
            <a href="https://webnotes.link" rel="noopener" target="_blank">
              Webnotes
            </a>{" "}
            is a free and open source web app that lets you create and manage
            notes. It's simple to use, works offline and because it runs in your
            browser you can use it across all your devices!
          </li>
        </ul>
        <ShareButton />
      </Paper>
    </Paper.Group>
  );
}
