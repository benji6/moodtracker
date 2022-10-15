import { Button } from "eri";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";
import {
  capitalizeFirstLetter,
  formatIsoDateInLocalTimezone,
} from "../../../../utils";
import {
  EventTypeCategories,
  Meditation,
  Mood,
  Weight,
} from "../../../../types";

type DenormalizedTrackedCatergories = Meditation[] | Mood[] | Weight[];

const createFilename = (
  dataType: EventTypeCategories,
  extension: "csv" | "json"
): string =>
  `moodtracker-${dataType}-export-${formatIsoDateInLocalTimezone(
    new Date()
  )}.${extension}`;

interface FlattenedDatum {
  [k: string]: number | string;
}

const downloadCsv = (
  dataType: EventTypeCategories,
  denormalizedData: DenormalizedTrackedCatergories
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
  dataType: EventTypeCategories,
  denormalizedData: DenormalizedTrackedCatergories
) => {
  saveAs(
    new Blob([JSON.stringify(denormalizedData)], {
      type: "application/json",
    }),
    createFilename(dataType, "json")
  );
};

interface Props {
  category: EventTypeCategories;
  denormalizedData: DenormalizedTrackedCatergories;
}

export default function ExportControls({ category, denormalizedData }: Props) {
  return denormalizedData.length ? (
    <>
      <h3>{capitalizeFirstLetter(category)}</h3>
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
    </>
  ) : null;
}
