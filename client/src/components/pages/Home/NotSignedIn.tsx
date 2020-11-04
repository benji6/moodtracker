import { Link, useNavigate } from "@reach/router";
import { Button, Paper } from "eri";
import * as React from "react";
import MoodByHourChart from "../../shared/MoodByHourChart";
import MoodChart from "../../shared/MoodChart";
import MoodFrequencyChart from "../../shared/MoodFrequencyChart";
import MoodSummary from "../../shared/MoodSummary";
import {
  LINE_CHART_DEMO_PROPS,
  MOOD_BY_HOUR_DEMO_PROPS,
  MOOD_FREQUENCY_DEMO_PROPS,
  MOOD_SUMMARY_DEMO_PROPS,
} from "./constants";

export default function NotSignedIn() {
  const navigate = useNavigate();
  const navigateToSignUp = () => navigate("/sign-up");

  return (
    <Paper.Group>
      <Paper>
        <h2>Welcome to MoodTracker!</h2>
        <p>
          MoodTracker is a free and open source web app that lets you track your
          mood. It's simple to use, works offline and because it runs in your
          browser you can use it across all your devices!
        </p>
        <Button.Group>
          <Button onClick={navigateToSignUp} type="button">
            Sign up now to get started!
          </Button>
        </Button.Group>
        <p>
          <small>
            If you already have an account you can{" "}
            <Link data-test-id="sign-in-link" to="/sign-in">
              sign in here
            </Link>
            .
          </small>
        </p>
      </Paper>
      <Paper>
        <h2>Features</h2>
        <p>The app is mostly just nice graphs 🤓</p>
        <h3>Analyze your mood over time</h3>
        <MoodChart {...LINE_CHART_DEMO_PROPS} />
        <h3>Review on a weekly or monthly basis</h3>
        <MoodSummary {...MOOD_SUMMARY_DEMO_PROPS} />
        <h3>See how often you log moods</h3>
        <MoodFrequencyChart {...MOOD_FREQUENCY_DEMO_PROPS} />
        <h3>See how your mood fluctuates over the day/week</h3>
        <p>
          MoodTracker can analyze your data over time to give you insights about
          how the time of day and day of the week influence your mood. This can
          help you understand yourself better 😌
        </p>
        <MoodByHourChart {...MOOD_BY_HOUR_DEMO_PROPS} />
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
