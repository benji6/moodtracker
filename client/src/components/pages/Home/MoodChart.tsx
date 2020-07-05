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
  const domainSpread = domain[1] - domain[0];
  const rangeSpread = range[1] - range[0];

  if (!moods.allIds.length) return null;

  return (
    <Paper>
      <h2>Mood graph</h2>
      <Graph>
        {moods.allIds.map((id) => {
          const mood = moods.byId[id];
          const x = (new Date(id).getTime() - domain[0]) / domainSpread;
          const y = mood.mood / rangeSpread;

          return (
            <Chart.Point key={id} x={x} y={y} title={`Mood: ${mood.mood}`} />
          );
        })}
      </Graph>
    </Paper>
  );
}
