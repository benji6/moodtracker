import * as React from "react";
import { Paper } from "eri";
import { Link } from "@reach/router";

export default function AddFirstMoodCta() {
  return (
    <Paper>
      <p>Welcome to MoodTracker!</p>
      <p>
        <Link to="/add">Add your first mood here</Link>
      </p>
    </Paper>
  );
}
