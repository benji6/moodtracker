import * as React from "react";
import { Paper } from "eri";
import { Link } from "@reach/router";

export default function AddFirstMoodCta() {
  return (
    <Paper>
      <p>Welcome to MoodTracker!</p>
      <p>
        <Link to="/add">Click here to add your first mood</Link>
      </p>
    </Paper>
  );
}
