import * as React from "react";
import { NormalizedMoods } from "../../../types";
import { Paper } from "eri";

interface IProps {
  domain: [number, number];
  moods: NormalizedMoods;
}

export default function MoodGraph({ domain, moods }: IProps) {
  const domainSpread = domain[1] - domain[0];
  const range = [0, 10];
  const rangeSpread = range[1] - range[0];
  const pointSideLength = 4;
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
            height: `calc(100% - ${pointSideLength}px)`,
            marginRight: pointSideLength,
            marginTop: pointSideLength,
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
                  height: pointSideLength,
                  position: "absolute",
                  width: pointSideLength,
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
