import { RouteComponentProps } from "@reach/router";
import { Icon, Nav, Paper } from "eri";
import * as React from "react";

export default function Settings(_: RouteComponentProps) {
  return (
    <Paper.Group>
      <Paper>
        <h2>Settings</h2>
        <Nav.SubList>
          <Nav.Link to="/settings/notifications">
            <Icon margin="right" name="bell" />
            Notifications
          </Nav.Link>
          <Nav.Link to="/settings/change-password">
            <Icon margin="right" name="lock" />
            Change password
          </Nav.Link>
          <Nav.Link to="/settings/export">
            <Icon margin="right" name="download" />
            Export data
          </Nav.Link>
        </Nav.SubList>
      </Paper>
    </Paper.Group>
  );
}
