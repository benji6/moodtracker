import * as React from "react";
import { NormalizedMoods } from "../../../types";
import { Paper } from "eri";
import Graph from "./Chart";
import Chart from "./Chart";

interface Props {
  domain: [number, number];
  moods: NormalizedMoods;
  range: [number, number];
}

export default function MoodChart({ domain, moods, range }: Props) {
  if (!moods.allIds.length) return null;

  return (
    <Paper>
      <h2>Mood graph</h2>
      <Graph domain={domain} range={range}>
        {moods.allIds.map((id) => {
          const mood = moods.byId[id];
          return (
            <Chart.Point
              key={id}
              x={new Date(id).getTime()}
              y={mood.mood}
              title={`Mood: ${mood.mood}`}
            />
          );
        })}
      </Graph>
    </Paper>
  );
}
