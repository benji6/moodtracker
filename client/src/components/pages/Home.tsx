import { RouteComponentProps } from "@reach/router";
import { Paper, ShareButton } from "eri";
import * as React from "react";

export default function Home(_: RouteComponentProps) {
  return (
    <Paper.Group>
      <Paper>
        <h2>Under construction</h2>
        <p>Come back soon!</p>
        <ShareButton />
      </Paper>
    </Paper.Group>
  );
}
