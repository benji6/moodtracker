import { Redirect, RouteComponentProps, useNavigate } from "@reach/router";
import * as React from "react";
import { useDispatch } from "react-redux";
import { MEDITATION_SEARCH_PARAM_TIME_KEY } from "../../../../constants";
import eventsSlice from "../../../../store/eventsSlice";
import { Meditation } from "../../../../types";
import useKeyboardEscape from "../../../hooks/useKeyboardEscape";
import { noSleep } from "../utils";
import bell from "./bell";
import MeditationTimerPresentation from "./MeditationTimerPresentation";

export type TimerState = "FINISHED" | "PAUSED" | "TIMING";

export default function MeditationTimer({ location }: RouteComponentProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location?.search);
  const timerDuration = Number(
    searchParams.get(MEDITATION_SEARCH_PARAM_TIME_KEY)
  );
  const [remainingTime, setRemainingTime] = React.useState(timerDuration * 1e3);
  const [timerState, setTimerState] = React.useState<TimerState>("TIMING");
  const [isDimmerEnabled, setIsDimmerEnabled] = React.useState(false);
  const [timeFinished, setTimeFinished] = React.useState<Date | undefined>();
  const initialTime = React.useRef(Date.now());
  const roundedSecondsRemaining = Math.round(remainingTime / 1e3);

  const onDim = React.useCallback(() => setIsDimmerEnabled(true), []);
  const onFinish = React.useCallback(() => {
    navigate("/meditate");
  }, [navigate]);
  const onFinishAndLog = React.useCallback(() => {
    const payload: Meditation = { seconds: Math.round(timerDuration) };
    let createdAt: string;
    if (timeFinished) createdAt = timeFinished.toISOString();
    else {
      // eslint-disable-next-line no-console
      console.warn(
        "Problem logging meditation: Expected finish time to be defined, falling back to log time instead"
      );
      createdAt = new Date().toISOString();
    }
    dispatch(
      eventsSlice.actions.add({
        type: "v1/meditations/create",
        createdAt,
        payload,
      })
    );
    onFinish();
  }, [dispatch, onFinish, timeFinished, timerDuration]);
  const onPause = React.useCallback(() => {
    noSleep.disable();
    setTimerState("PAUSED");
  }, []);
  const onPlay = React.useCallback(() => {
    noSleep.enable();
    initialTime.current =
      Date.now() + roundedSecondsRemaining * 1e3 - timerDuration * 1e3;
    setTimerState("TIMING");
  }, [roundedSecondsRemaining, timerDuration]);
  const onReveal = React.useCallback(() => setIsDimmerEnabled(false), []);

  useKeyboardEscape(() => setIsDimmerEnabled(false));

  React.useEffect(() => {
    noSleep.enable();
    return () => {
      bell.stop();
      noSleep.disable();
    };
  }, []);

  React.useEffect(() => {
    let abort = false;
    requestAnimationFrame(function update() {
      if (timerState === "FINISHED" || timerState === "PAUSED" || abort) return;
      requestAnimationFrame(update);
      const t = timerDuration * 1e3 - (Date.now() - initialTime.current);
      if (t > 0) return setRemainingTime(t);
      setTimeFinished(new Date());
      setTimerState("FINISHED");
      bell.start();
      noSleep.disable();
      setRemainingTime(0);
      if (isDimmerEnabled) setIsDimmerEnabled(false);
    });
    return () => void (abort = true);
  }, [isDimmerEnabled, timerDuration, timerState]);

  if (!searchParams.has(MEDITATION_SEARCH_PARAM_TIME_KEY))
    return <Redirect to="/meditate" />;

  return (
    <MeditationTimerPresentation
      dimmed={isDimmerEnabled}
      onDim={onDim}
      onFinish={onFinish}
      onPause={onPause}
      onPlay={onPlay}
      onFinishAndLog={onFinishAndLog}
      onReveal={onReveal}
      roundedSecondsRemaining={roundedSecondsRemaining}
      timerState={timerState}
      totalSeconds={timerDuration}
    />
  );
}
