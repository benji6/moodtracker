import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Meditation } from "../../../../../types";
import OpenEndedMeditationPresentation from "./OpenEndedMeditationPresentation";
import deviceSlice from "../../../../../store/deviceSlice";
import eventsSlice from "../../../../../store/eventsSlice";
import { useNavigate } from "react-router-dom";
import useWakeLock from "../../../../hooks/useWakeLock";

export default function OpenEndedMeditation() {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isDimmerEnabled, setIsDimmerEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dispatch = useDispatch();
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const navigate = useNavigate();
  const initialTime = useRef(Date.now());
  const roundedSecondsElapsed = Math.round(secondsElapsed);
  const wakeLock = useWakeLock();

  const onDim = useCallback(() => setIsDimmerEnabled(true), []);
  const onFinishAndLog = useCallback(() => {
    const payload: Meditation = { seconds: roundedSecondsElapsed };
    if (geolocation) payload.location = geolocation;

    dispatch(
      eventsSlice.actions.add({
        type: "v1/meditations/create",
        createdAt: new Date().toISOString(),
        payload,
      }),
    );
    navigate("/");
  }, [dispatch, geolocation, navigate, roundedSecondsElapsed]);
  const onPause = useCallback(() => {
    wakeLock.disable();
    setIsPaused(true);
  }, [wakeLock]);
  const onPlay = useCallback(() => {
    wakeLock.enable();
    initialTime.current = Date.now() - roundedSecondsElapsed * 1e3;
    setIsPaused(false);
  }, [roundedSecondsElapsed, wakeLock]);
  const onUndim = useCallback(() => setIsDimmerEnabled(false), []);

  useEffect(() => {
    wakeLock.enable();
    return () => void wakeLock.disable();
  }, [wakeLock]);

  useEffect(() => {
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
      onUndim={onUndim}
      roundedSeconds={roundedSecondsElapsed}
    />
  );
}
