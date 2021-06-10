import { Redirect, RouteComponentProps, useNavigate } from "@reach/router";
import NoSleep from "nosleep.js";
import * as React from "react";
import { useDispatch } from "react-redux";
import { MEDITATION_SEARCH_PARAM_TIME_KEY } from "../../../constants";
import eventsSlice from "../../../store/eventsSlice";
import { Meditation } from "../../../types";
import useKeyboardEscape from "../../hooks/useKeyboardEscape";
import bell from "./bell";
import MeditationTimerPresentation from "./MeditationTimerPresentation";

const noSleep = new NoSleep();

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
  const initialTime = React.useRef(Date.now());
  const roundedSecondsRemaining = Math.round(remainingTime / 1e3);

  const onDim = React.useCallback(() => setIsDimmerEnabled(true), []);
  const onFinish = React.useCallback(() => {
    navigate("/meditate");
  }, [navigate]);
  const onRecordAndFinish = React.useCallback(() => {
    const payload: Meditation = { seconds: Math.round(timerDuration) };
    dispatch(
      eventsSlice.actions.add({
        type: "v1/meditations/create",
        createdAt: new Date().toISOString(),
        payload,
      })
    );
    onFinish();
  }, [dispatch, onFinish, timerDuration]);
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
      onRecordAndFinish={onRecordAndFinish}
      onReveal={onReveal}
      roundedSecondsRemaining={roundedSecondsRemaining}
      timerState={timerState}
      totalSeconds={timerDuration}
    />
  );
}
