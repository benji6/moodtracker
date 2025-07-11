import { DenormalizedEvents, EventTypeCategories } from "../../types";
import { Button } from "eri";
import { formatIsoDateInLocalTimezone } from "../../utils";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";

const createFilename = (
  dataType: EventTypeCategories,
  extension: "csv" | "json",
): string =>
  `moodtracker-${dataType}-export-${formatIsoDateInLocalTimezone(
    new Date(),
  )}.${extension}`;

type FlattenedDatum = Record<string, number | string>;

const downloadCsv = (
  dataType: EventTypeCategories,
  denormalizedData: DenormalizedEvents,
) => {
  const columns = new Set<string>();
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
        val as Record<string, number | string>,
      )) {
        const flattenedKey = `${key}:${k}`;
        flattenedDatum[flattenedKey] = v;
        columns.add(flattenedKey);
      }
    }
    flattenedDenormalizedData.push(flattenedDatum);
  }

  saveAs(
    new Blob(
      [
        unparse(flattenedDenormalizedData, {
          columns: [...columns].sort((a, b) => a.localeCompare(b)),
        }),
      ],
      {
        type: "text/csv",
      },
    ),
    createFilename(dataType, "csv"),
  );
};

const downloadJson = (
  dataType: EventTypeCategories,
  denormalizedData: DenormalizedEvents,
) => {
  saveAs(
    new Blob([JSON.stringify(denormalizedData)], {
      type: "application/json",
    }),
    createFilename(dataType, "json"),
  );
};

interface Props {
  category: EventTypeCategories;
  denormalizedData: DenormalizedEvents;
}

export default function ExportControls({ category, denormalizedData }: Props) {
  return denormalizedData.length ? (
    <Button.Group>
      <Button
        onClick={() => downloadCsv(category, denormalizedData)}
        type="button"
      >
        Export as CSV
      </Button>
      <Button
        onClick={() => downloadJson(category, denormalizedData)}
        type="button"
        variant="secondary"
      >
        Export as JSON
      </Button>
    </Button.Group>
  ) : null;
}
