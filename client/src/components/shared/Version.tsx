import * as React from "react";
import { BUILD_TIME } from "../../constants";
import { dateFormatter } from "../../dateTimeFormatters";

export default function Version() {
  return (
    <p>
      The version you&apos;re currently using was last updated on{" "}
      <b>{dateFormatter.format(new Date(BUILD_TIME))}</b>.
    </p>
  );
}
