import { REPO_ISSUES_URL, REPO_URL } from "../../../constants";
import { Link } from "react-router-dom";
import { Paper } from "eri";

export default function PrivacyPolicy() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Privacy policy</h2>
        <h3>Tl;dr</h3>
        <p>
          This project is{" "}
          <a href={REPO_URL} rel="noopener" target="_blank">
            open source
          </a>{" "}
          so we are totally transparent about how we store your data securely.
          Further to this, we do not sell or share any of your data with anyone.
        </p>
        <h3>What we collect and why</h3>
        <p>
          We collect the minimum data required for the app to function. That
          means we take your email address when you sign up and we collect all
          the data you submit while using the app.
        </p>
        <p>
          We also collect data on errors and crashes that we send to a{" "}
          <a href="https://sentry.io" rel="noopener" target="_blank">
            3rd party development tool
          </a>
          . This typically does not include any user data.
        </p>
        <h3>Information we do not collect</h3>
        <p>
          We do not collect any data that is unnecessary for running the app, we
          do not collect any data you have not submitted to us, we do not use
          cookies and we do not run any 3rd party analytics.
        </p>
        <h3>Changes</h3>
        <p>
          We may update this policy in the future if regulations or practices
          change. Because the project is open source you can view the history of
          this policy{" "}
          <a href={REPO_URL} rel="noopener" target="_blank">
            on GitHub
          </a>
          . We will announce any significant policy changes on{" "}
          <Link to="/blog">our blog</Link>.
        </p>
        <h3>Questions</h3>
        <p>
          If you have any questions or feedback on this policy then please feel
          free to{" "}
          <a href={REPO_ISSUES_URL} rel="noopener" target="_blank">
            raise an issue on GitHub
          </a>
          .
        </p>
      </Paper>
    </Paper.Group>
  );
}
