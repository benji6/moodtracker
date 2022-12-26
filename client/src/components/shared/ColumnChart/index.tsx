import { CSSProperties, Fragment, HTMLAttributes, Key, ReactNode } from "react";
import { Optional } from "../../../typeUtilities";
import { roundUpToNearest10 } from "../../../utils";
import "./style.css";

interface ColumnWithdata {
  y: number;
  color: string;
  label: ReactNode;
  key: Key;
  title?: string;
}

type ColumnWithoutData = Optional<ColumnWithdata, "y" | "color">;

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: (ColumnWithoutData | ColumnWithdata)[];
  maxRange?: number;
  onBarClick?(xIndex: number): void;
  rotateXLabels?: boolean;
  xAxisTitle: string;
  yAxisTitle: string;
}

export default function ColumnChart({
  data,
  maxRange,
  onBarClick,
  rotateXLabels = false,
  xAxisTitle: xTitle,
  yAxisTitle: yTitle,
  ...rest
}: Props) {
  if (!data.length) return null;

  let range: [number, number];
  if (maxRange === undefined) {
    const maxY = Math.max(
      ...data.filter(({ y }) => y !== undefined).map(({ y }) => y as number)
    );
    range = [0, maxY < 5 ? 5 : roundUpToNearest10(maxY)];
  } else range = [0, maxRange];
  const yLabels: number[] =
    range[1] <= 10
      ? [...Array(range[1] + 1).keys()]
      : [...Array(11).keys()].map((n) => Math.round((n / 10) * range[1]));

  return (
    <div
      {...rest}
      className="column-chart"
      style={{ "--column-count": data.length } as CSSProperties}
    >
      <div className="column-chart__grid-lines">
        {yLabels.slice(1).map((x) => (
          <div key={x} />
        ))}
      </div>
      <div className="column-chart__y-title fade-in nowrap">{yTitle}</div>
      <div className="column-chart__x-title fade-in">{xTitle}</div>
      <div className="column-chart__x-label" />
      <div
        className="column-chart__y-axis"
        style={{ "--y-label-count": yLabels.length } as CSSProperties}
      >
        {yLabels.map((yLabel, i) => (
          <div
            className="column-chart__y-label fade-in"
            key={yLabel}
            style={{ "--y-label-number": i } as CSSProperties}
          >
            {yLabel}
          </div>
        ))}
      </div>
      <div className="column-chart__x-label" />
      {data.map(({ key, y, title, label, color }, i) => {
        return (
          <Fragment key={key}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions*/}
            <div
              className={`column-chart__column${
                onBarClick ? " column-chart__column--clickable" : ""
              }`}
              onClick={onBarClick && (() => onBarClick(i))}
              title={title}
              style={
                {
                  color: color ?? "transparent",
                  "--column-height":
                    y === undefined ? 0 : `${(100 * y) / range[1]}%`,
                  "--column-number": i,
                } as CSSProperties
              }
            />
            <div
              className={`column-chart__x-label${
                rotateXLabels ? " column-chart__x-label--rotate" : ""
              }`}
              style={
                {
                  "--x-label-number": i,
                } as CSSProperties
              }
              title={title}
            >
              {label}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
