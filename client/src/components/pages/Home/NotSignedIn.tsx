import { Link, useNavigate } from "@reach/router";
import { Button, Paper, WordCloud } from "eri";
import * as React from "react";
import { TEST_IDS } from "../../../constants";
import MoodByHourChart from "../../shared/MoodByHourChart";
import MoodByWeekdayChart from "../../shared/MoodByWeekdayChart";
import MoodChart from "../../shared/MoodChart";
import MoodFrequencyChart from "../../shared/MoodFrequencyChart";
import MoodSummary from "../../shared/MoodSummary";
import {
  LINE_CHART_PROPS,
  MOOD_BY_HOUR_PROPS,
  MOOD_BY_WEEKDAY_PROPS,
  MOOD_FREQUENCY_PROPS,
  MOOD_SUMMARY_PROPS,
  WORD_CLOUD_PROPS,
} from "./constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const addMoodImgSrc = require("../Blog/2020-12-30/screenshot-1.png");

export default function NotSignedIn() {
  const navigate = useNavigate();
  const navigateToSignUp = () => navigate("/sign-up");

  return (
    <Paper.Group>
      <Paper>
        <h2>Welcome to MoodTracker!</h2>
        <p>
          MoodTracker is a free and open source web app app that aims to help
          you understand yourself better. Track your emotional landscape, keep a
          mood journal and gain new insights into yourself. It&apos;s simple to
          use, works offline and because it runs in your browser you can use it
          across all your devices!
        </p>
        <Button.Group>
          <Button onClick={navigateToSignUp} type="button">
            Sign up now to get started!
          </Button>
        </Button.Group>
        <p>
          <small>
            If you already have an account you can{" "}
            <Link data-test-id={TEST_IDS.signInLink} to="/sign-in">
              sign in here
            </Link>
            .
          </small>
        </p>
      </Paper>
      <Paper>
        <h2>Features</h2>
        <h3>Record how you feel and why</h3>
        <img
          alt="Screenshot demonstrating adding a mood with an exploration"
          src={addMoodImgSrc}
        />
        <h3>Analyze your mood over time</h3>
        <MoodChart {...LINE_CHART_PROPS} />
        <h3>Describe how you feel and reflect on it</h3>
        <p>
          You can record a short description of your mood and reflect on it on a
          day-by-day, week-by-week, month-by-month or year-by-year basis.
        </p>
        <WordCloud
          aria-label="Word cloud displaying mood descriptions"
          words={WORD_CLOUD_PROPS}
        />
        <h3>Review on a daily, weekly, monthly or yearly basis</h3>
        <p>Opt in to receive weekly email updates!</p>
        <MoodSummary {...MOOD_SUMMARY_PROPS} />
        <h3>See how your mood fluctuates by day of the week</h3>
        <p>
          MoodTracker can analyze your data over time to give you insights about
          how the day of the week influences your mood.
        </p>
        <MoodByWeekdayChart {...MOOD_BY_WEEKDAY_PROPS} />
        <h3>See how your mood fluctuates by the time of day</h3>
        <p>
          MoodTracker can also analyze your data over time to give you insights
          about how the time of day influences your mood. This can help you
          understand yourself better 😌
        </p>
        <MoodByHourChart {...MOOD_BY_HOUR_PROPS} />
        <h3>And much more!</h3>
        <p>See how often you log moods.</p>
        <MoodFrequencyChart {...MOOD_FREQUENCY_PROPS} />
      </Paper>
      <Paper>
        <h2>Find out more</h2>
        <p>
          Read about our ongoing development efforts on our{" "}
          <Link to="/blog">blog</Link>, or check out our{" "}
          <Link to="/about">about page</Link>.
        </p>
      </Paper>
      <Paper>
        <h2>Give it a go!</h2>
        <Button.Group>
          <Button onClick={navigateToSignUp} type="button">
            Sign up here
          </Button>
        </Button.Group>
        <p>
          <small>
            Or <Link to="/sign-in">sign in</Link> if you already have an
            account.
          </small>
        </p>
      </Paper>
    </Paper.Group>
  );
}
