import { Button, Paper, WordCloud } from "eri";
import { Link, useNavigate } from "react-router-dom";
import { MOODTRACKER_DESCRIPTION, TEST_IDS } from "../../../constants";
import LocationMap from "../../shared/LocationMap";
import MoodByHourChart from "../../shared/MoodByHourChart";
import MoodByWeekdayChart from "../../shared/MoodByWeekdayChart";
import MoodChart from "../../shared/MoodChart";
import MoodFrequencyChart from "../../shared/MoodFrequencyChart";
import MoodSummary from "../../shared/MoodSummary";
import MeditationTimerClock from "../Meditate/MeditationTimer/MeditationTimerPresentation/MeditationTimerClock";
import {
  LINE_CHART_PROPS,
  MOOD_BY_HOUR_PROPS,
  MOOD_BY_WEEKDAY_PROPS,
  MOOD_FREQUENCY_PROPS,
  MOOD_SUMMARY_PROPS,
  WORD_CLOUD_PROPS,
} from "./constants";

const addMoodImgSrc = String(
  new URL("../Blog/2020-12-30/screenshot-1.png", import.meta.url)
);

export default function NotSignedIn() {
  const navigate = useNavigate();
  const navigateToSignUp = () => navigate("/sign-up");

  return (
    <Paper.Group>
      <Paper>
        <h2>Welcome to MoodTracker!</h2>
        <p>{MOODTRACKER_DESCRIPTION}</p>
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
        <p>Opt in to receive weekly email updates.</p>
        <MoodSummary {...MOOD_SUMMARY_PROPS} showMeditationStatsOverride />
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
        <h3>Meditate</h3>
        <p>
          MoodTracker has a built in meditation timer and meditation log so you
          can track your practice and see how it interacts with your mood over
          time.
        </p>
        <MeditationTimerClock remainingSeconds={222} totalSeconds={600} />
        <h3>
          See where you were when you logged your mood or did your meditation
        </h3>
        <p>
          This functionality is only available if you opt in to recording your
          location. We have an easy to configure permissions system if you are
          privacy conscious (see the <Link to="/about">about page</Link> for our
          privacy policy).
        </p>
        <LocationMap>
          <LocationMap.Marker latitude={48.8566} longitude={2.3522} />
          <LocationMap.Marker latitude={40.7128} longitude={-74.006} />
        </LocationMap>
        <h3>See how often you log moods</h3>
        <MoodFrequencyChart {...MOOD_FREQUENCY_PROPS} />
        <h3>And much more!</h3>
        <ul>
          <li>Set up weekly email reports</li>
          <li>
            Export your data at any time, put it in a spreadsheet or do whatever
            you want with it
          </li>
          <li>
            See how the moods you register before meditation differ from the
            ones you register after meditation
          </li>
          <li>Discover more visualizations and features by signing up!</li>
        </ul>
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
