import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deviceGeolocationSelector } from "../../../../selectors";
import eventsSlice from "../../../../store/eventsSlice";
import { Meditation } from "../../../../types";
import useKeyboardEscape from "../../../hooks/useKeyboardEscape";
import { noSleep } from "../nosleep";
import OpenEndedMeditationPresentation from "./OpenEndedMeditationPresentation";

export default function OpenEndedMeditation() {
  const [secondsElapsed, setSecondsElapsed] = React.useState(0);
  const [isDimmerEnabled, setIsDimmerEnabled] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const dispatch = useDispatch();
  const geolocation = useSelector(deviceGeolocationSelector);
  const navigate = useNavigate();
  const initialTime = React.useRef(Date.now());
  const roundedSecondsElapsed = Math.round(secondsElapsed);

  const onDim = React.useCallback(() => setIsDimmerEnabled(true), []);
  const onFinishAndLog = React.useCallback(() => {
    const payload: Meditation = { seconds: roundedSecondsElapsed };
    if (geolocation) payload.location = geolocation;

    dispatch(
      eventsSlice.actions.add({
        type: "v1/meditations/create",
        createdAt: new Date().toISOString(),
        payload,
      })
    );
    navigate("/meditation");
  }, [dispatch, geolocation, navigate, roundedSecondsElapsed]);
  const onPause = React.useCallback(() => {
    noSleep.disable();
    setIsPaused(true);
  }, []);
  const onPlay = React.useCallback(() => {
    noSleep.enable();
    initialTime.current = Date.now() - roundedSecondsElapsed * 1e3;
    setIsPaused(false);
  }, [roundedSecondsElapsed]);
  const onReveal = React.useCallback(() => setIsDimmerEnabled(false), []);

  useKeyboardEscape(() => setIsDimmerEnabled(false));

  React.useEffect(() => {
    noSleep.enable();
    return () => {
      noSleep.disable();
    };
  }, []);

  React.useEffect(() => {
    let abort = false;
    requestAnimationFrame(function update() {
      if (isPaused || abort) return;
      requestAnimationFrame(update);
      setSecondsElapsed((Date.now() - initialTime.current) / 1e3);
    });
    return () => void (abort = true);
  }, [isPaused, setSecondsElapsed]);

  return (
    <OpenEndedMeditationPresentation
      dimmed={isDimmerEnabled}
      isPaused={isPaused}
      onDim={onDim}
      onFinishAndLog={onFinishAndLog}
      onPause={onPause}
      onPlay={onPlay}
      onReveal={onReveal}
      roundedSeconds={roundedSecondsElapsed}
    />
  );
}
