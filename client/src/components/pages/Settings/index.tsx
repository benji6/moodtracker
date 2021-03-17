import { RouteComponentProps } from "@reach/router";
import { Icon, Menu, Paper } from "eri";
import * as React from "react";

export default function Settings(_: RouteComponentProps) {
  return (
    <Paper.Group>
      <Paper>
        <h2>Settings</h2>
        <Menu.SubList>
          <Menu.Link to="/settings/notifications">
            <Icon margin="right" name="bell" />
            Notifications
          </Menu.Link>
          <Menu.Link to="/settings/change-password">
            <Icon margin="right" name="lock" />
            Change password
          </Menu.Link>
          <Menu.Link to="/settings/export">
            <Icon margin="right" name="download" />
            Export data
          </Menu.Link>
        </Menu.SubList>
      </Paper>
    </Paper.Group>
  );
}
