import { RouteComponentProps } from "@reach/router";
import { Button, Paper, Spinner } from "eri";
import { saveAs } from "file-saver";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  denormalizedMoodsSelector,
} from "../../../selectors";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import { unparse } from "papaparse";
import { formatIsoDateInLocalTimezone } from "../../../utils";

const createFilename = (extension: "csv" | "json"): string =>
  `moodtracker-data-export-${formatIsoDateInLocalTimezone(
    new Date()
  )}.${extension}`;

export default function Export(_: RouteComponentProps) {
  const denormalizedMoods = useSelector(denormalizedMoodsSelector);

  useRedirectUnauthed();
  if (useSelector(appIsStorageLoadingSelector)) return <Spinner />;

  return (
    <Paper.Group>
      <Paper>
        <h2>Export data</h2>
        <p>
          You can download all your data from here. Choose CSV format if you
          want to load your data into a spreadsheet and take a closer look.
        </p>
        <Button.Group>
          <Button
            onClick={() => {
              const columns: Set<string> = new Set();
              for (const mood of denormalizedMoods)
                for (const key of Object.keys(mood)) columns.add(key);
              saveAs(
                new Blob(
                  [unparse(denormalizedMoods, { columns: [...columns] })],
                  { type: "text/csv" }
                ),
                createFilename("csv")
              );
            }}
          >
            Export as CSV
          </Button>
          <Button
            onClick={() => {
              saveAs(
                new Blob([JSON.stringify(denormalizedMoods)], {
                  type: "application/json",
                }),
                createFilename("json")
              );
            }}
            variant="secondary"
          >
            Export as JSON
          </Button>
        </Button.Group>
      </Paper>
    </Paper.Group>
  );
}
