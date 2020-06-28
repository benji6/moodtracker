import * as React from "react";
import { NormalizedMoods } from "../../../types";
import { Paper } from "eri";

interface IProps {
  domain: [number, number];
  moods: NormalizedMoods;
}

export default function MoodGraph({ domain, moods }: IProps) {
  const [width, setWidth] = React.useState(0);
  const domainSpread = domain[1] - domain[0];
  const range = [0, 10];
  const rangeSpread = range[1] - range[0];
  const pointSideLength = 4;
  const height = 200;

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.clientWidth);
  }, [ref.current]);

  if (!moods.allIds.length) return null;

  return (
    <Paper>
      <h2>Mood graph</h2>
      <div
        ref={ref}
        style={{
          border: "1px solid var(--e-color-figure)",
          borderRadius: "var(--e-border-radius-0)",
          filter: "var(--e-drop-shadow-0)",
          height,
        }}
      >
        {moods.allIds.map((id) => {
          const mood = moods.byId[id];
          const x =
            ((new Date(id).getTime() - domain[0]) / domainSpread) *
            (width - pointSideLength);
          const y =
            height -
            pointSideLength -
            (mood.mood / rangeSpread) * (height - pointSideLength);

          return (
            <div
              key={id}
              style={{
                background: "var(--e-color-theme)",
                borderRadius: "50%",
                height: pointSideLength,
                position: "absolute",
                width: pointSideLength,
                transform: `translate(${x}px, ${y}px)`,
              }}
              title={`Mood: ${mood.mood}`}
            />
          );
        })}
      </div>
    </Paper>
  );
}
