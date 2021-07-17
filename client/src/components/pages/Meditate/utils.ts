import NoSleep from "nosleep.js";
import { TIME } from "../../../constants";

export const formatSecondsAsTime = (seconds: number): string =>
  `${String(Math.floor(seconds / TIME.secondsPerMinute)).padStart(
    2,
    "0"
  )}:${String(Math.floor(seconds % TIME.secondsPerMinute)).padStart(2, "0")}`;

export const noSleep = new NoSleep();
