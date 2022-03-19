import { Button, Paper } from "eri";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import {
  denormalizedMeditationsSelector,
  denormalizedMoodsSelector,
} from "../../../selectors";
import { unparse } from "papaparse";
import { formatIsoDateInLocalTimezone } from "../../../utils";
import { Meditation, Mood } from "../../../types";
import { useNavigate } from "react-router-dom";

type DataType = "meditation" | "mood";
type DenormalizedData = (Meditation | Mood)[];

const createFilename = (
  dataType: DataType,
  extension: "csv" | "json"
): string =>
  `moodtracker-${dataType}-export-${formatIsoDateInLocalTimezone(
    new Date()
  )}.${extension}`;

interface FlattenedDatum {
  [k: string]: number | string;
}

const downloadCsv = (
  dataType: DataType,
  denormalizedData: DenormalizedData
) => {
  const columns: Set<string> = new Set();
  const flattenedDenormalizedData: FlattenedDatum[] = [];

  for (const datum of denormalizedData) {
    const flattenedDatum: FlattenedDatum = {};
    for (const [key, val] of Object.entries(datum)) {
      if (typeof val !== "object") {
        flattenedDatum[key] = val;
        columns.add(key);
        continue;
      }
      for (const [k, v] of Object.entries(
        val as Record<string, number | string>
      )) {
        const flattenedKey = `${key}:${k}`;
        flattenedDatum[flattenedKey] = v;
        columns.add(flattenedKey);
      }
    }
    flattenedDenormalizedData.push(flattenedDatum);
  }

  saveAs(
    new Blob([unparse(flattenedDenormalizedData, { columns: [...columns] })], {
      type: "text/csv",
    }),
    createFilename(dataType, "csv")
  );
};

const downloadJson = (
  dataType: DataType,
  denormalizedData: DenormalizedData
) => {
  saveAs(
    new Blob([JSON.stringify(denormalizedData)], {
      type: "application/json",
    }),
    createFilename(dataType, "json")
  );
};

export default function Export() {
  const denormalizedMeditations = useSelector(denormalizedMeditationsSelector);
  const denormalizedMoods = useSelector(denormalizedMoodsSelector);
  const navigate = useNavigate();

  return (
    <Paper.Group>
      <Paper>
        <h2>Export data</h2>
        {!denormalizedMeditations.length && !denormalizedMoods.length ? (
          <>
            <p>No data to export</p>
            <Button.Group>
              <Button onClick={() => navigate(`/add`)} type="button">
                Add your first mood!
              </Button>
            </Button.Group>
          </>
        ) : (
          <>
            <p>
              You can download all your data from here. Choose CSV format if you
              want to load your data into a spreadsheet and take a closer look.
            </p>
            {denormalizedMoods.length && (
              <>
                <h3>Moods</h3>
                <Button.Group>
                  <Button
                    onClick={() => downloadCsv("mood", denormalizedMoods)}
                    type="button"
                  >
                    Export as CSV
                  </Button>
                  <Button
                    onClick={() => downloadJson("mood", denormalizedMoods)}
                    type="button"
                    variant="secondary"
                  >
                    Export as JSON
                  </Button>
                </Button.Group>
              </>
            )}
            {denormalizedMeditations.length && (
              <>
                <h3>Meditations</h3>
                <Button.Group>
                  <Button
                    onClick={() =>
                      downloadCsv("meditation", denormalizedMeditations)
                    }
                    type="button"
                  >
                    Export as CSV
                  </Button>
                  <Button
                    onClick={() =>
                      downloadJson("meditation", denormalizedMeditations)
                    }
                    type="button"
                    variant="secondary"
                  >
                    Export as JSON
                  </Button>
                </Button.Group>
              </>
            )}
          </>
        )}
      </Paper>
    </Paper.Group>
  );
}
