import * as React from "react";
import { NormalizedMoods } from "../../../types";
import { Paper } from "eri";
import Chart from "./Chart";

interface Props {
  domain: [number, number];
  moods: NormalizedMoods;
  range: [number, number];
}

export default function MoodChart({ domain, moods, range }: Props) {
  if (!moods.allIds.length) return null;

  const data = moods.allIds.map((id) => {
    const mood = moods.byId[id];
    return {
      x: new Date(id).getTime(),
      y: mood.mood,
      title: `Mood: ${mood.mood}`,
    };
  });

  return (
    <Paper>
      <h2>Mood chart</h2>
      <Chart data={data} domain={domain} range={range} />
    </Paper>
  );
}
