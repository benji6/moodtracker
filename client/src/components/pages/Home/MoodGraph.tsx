import * as React from "react";
import { NormalizedMoods } from "../../../types";
import { Paper } from "eri";

const POINT_SIZE = 4;

interface Props {
  domain: [number, number];
  moods: NormalizedMoods;
  range: [number, number];
}

export default function MoodGraph({ domain, moods, range }: Props) {
  const domainSpread = domain[1] - domain[0];
  const rangeSpread = range[1] - range[0];
  const height = 200;

  if (!moods.allIds.length) return null;

  return (
    <Paper>
      <h2>Mood graph</h2>
      <div
        style={{
          border: "var(--e-border-default)",
          filter: "var(--e-drop-shadow-0)",
          height,
        }}
      >
        <div
          style={{
            height: `calc(100% - ${POINT_SIZE}px)`,
            marginRight: POINT_SIZE,
            marginTop: POINT_SIZE,
            position: "relative",
          }}
        >
          {moods.allIds.map((id) => {
            const mood = moods.byId[id];
            const x = (new Date(id).getTime() - domain[0]) / domainSpread;
            const y = mood.mood / rangeSpread;

            return (
              <div
                key={id}
                style={{
                  background: "var(--e-color-theme)",
                  borderRadius: "50%",
                  height: POINT_SIZE,
                  position: "absolute",
                  width: POINT_SIZE,
                  left: `${x * 100}%`,
                  bottom: `${y * 100}%`,
                }}
                title={`Mood: ${mood.mood}`}
              />
            );
          })}
        </div>
      </div>
    </Paper>
  );
}
