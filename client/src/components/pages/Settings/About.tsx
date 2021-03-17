import { RouteComponentProps } from "@reach/router";
import { Paper, ShareButton } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { TOTAL_USERS } from "../../../constants";
import { userIsSignedInSelector } from "../../../selectors";

export default function About(_: RouteComponentProps) {
  const isSignedIn = useSelector(userIsSignedInSelector);
  return (
    <Paper.Group>
      <Paper>
        <h2>About</h2>
        <p>
          MoodTracker is a free and open source web app app that aims to help
          you understand yourself better. Track your emotional landscape, keep a
          mood journal and gain new insights into yourself. It&apos;s simple to
          use, works offline and because it runs in your browser you can use it
          across all your devices!
        </p>
        {isSignedIn ? (
          <p>
            You are one of <b>{TOTAL_USERS}</b> registered users! 📈
          </p>
        ) : (
          <p>
            There are currently <b>{TOTAL_USERS}</b> registered users! 📈
          </p>
        )}
        <p>
          You can find the source code{" "}
          <a
            href="https://github.com/benji6/moodtracker"
            rel="noopener"
            target="_blank"
          >
            here
          </a>{" "}
          and if you have any ideas, feedback or bugs you can raise them{" "}
          <a
            href="https://github.com/benji6/moodtracker/issues"
            rel="noopener"
            target="_blank"
          >
            here
          </a>{" "}
          🐛
        </p>
        <p>
          The UI was put together using a component library I built called{" "}
          <a
            href="https://github.com/benji6/eri"
            rel="noopener"
            target="_blank"
          >
            Eri
          </a>
          .
        </p>
        <p>I hope you enjoy the app 🙂</p>
        <ShareButton />
      </Paper>
    </Paper.Group>
  );
}
