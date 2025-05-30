import { initialState, reducer } from "./reducer";
import { useBeforeUnload, useNavigate, useSearchParams } from "react-router";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import LogMeditationDialog from "./LogMeditationDialog";
import { MEDITATION_SEARCH_PARAM_TIME_KEY } from "../../../../../constants";
import { Meditation } from "../../../../../types";
import MeditationTimerPresentation from "./MeditationTimerPresentation";
import { captureException } from "../../../../../sentry";
import deviceSlice from "../../../../../store/deviceSlice";
import eventsSlice from "../../../../../store/eventsSlice";
import useBell from "./useBell";
import useWakeLock from "../../../../hooks/useWakeLock";

export default function MeditationTimer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [localState, localDispatch] = useReducer(reducer, initialState);
  const bell = useBell();
  const wakeLock = useWakeLock();

  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const timerDurationInSeconds = Number(
    searchParams.get(MEDITATION_SEARCH_PARAM_TIME_KEY),
  );
  const initialTime = useRef(Date.now());
  const roundedSecondsRemaining = Math.round(
    (localState.remainingTime ?? timerDurationInSeconds * 1e3) / 1e3,
  );
  const secondsMeditated = timerDurationInSeconds - roundedSecondsRemaining;

  const onDim = useCallback(
    () => localDispatch({ payload: true, type: "isDimmerEnabled/set" }),
    [],
  );
  const onDontLog = useCallback(() => {
    navigate("/meditation");
  }, [navigate]);
  const onPause = useCallback(() => {
    wakeLock?.disable();
    localDispatch({ payload: "PAUSED", type: "timerState/set" });
  }, [wakeLock]);
  const onPlay = useCallback(() => {
    wakeLock?.enable();
    initialTime.current =
      Date.now() + roundedSecondsRemaining * 1e3 - timerDurationInSeconds * 1e3;
    localDispatch({ payload: "TIMING", type: "timerState/set" });
  }, [roundedSecondsRemaining, timerDurationInSeconds, wakeLock]);
  const onUndim = useCallback(
    () => localDispatch({ payload: false, type: "isDimmerEnabled/set" }),
    [],
  );

  const onCloseDialog = useCallback(() => {
    localDispatch({ payload: false, type: "isDialogOpen/set" });
    onPlay();
  }, [onPlay]);
  const onFinish = useCallback(() => {
    if (secondsMeditated) {
      localDispatch({ payload: true, type: "isDialogOpen/set" });
      onPause();
    } else onDontLog();
  }, [onDontLog, onPause, secondsMeditated]);
  const onLog = useCallback(() => {
    const payload: Meditation = { seconds: Math.round(secondsMeditated) };
    if (geolocation) payload.location = geolocation;

    let createdAt: string;
    if (localState.timeFinished)
      createdAt = localState.timeFinished.toISOString();
    else {
      captureException(
        Error(
          "Problem logging meditation: Expected finish time to be defined, falling back to log time instead",
        ),
      );
      createdAt = new Date().toISOString();
    }
    dispatch(
      eventsSlice.actions.add({
        type: "v1/meditations/create",
        createdAt,
        payload,
      }),
    );
    navigate("/");
  }, [
    dispatch,
    geolocation,
    localState.timeFinished,
    navigate,
    secondsMeditated,
  ]);

  useEffect(() => {
    wakeLock?.enable();
    return () => {
      bell?.stop();
      wakeLock?.disable();
    };
  }, [bell, wakeLock]);

  useEffect(() => {
    let abort = false;
    requestAnimationFrame(function update() {
      if (
        localState.timerState === "FINISHED" ||
        localState.timerState === "PAUSED" ||
        abort
      )
        return;
      requestAnimationFrame(update);
      const t =
        timerDurationInSeconds * 1e3 - (Date.now() - initialTime.current);
      if (t > 0)
        return localDispatch({ payload: t, type: "remainingTime/set" });

      localDispatch({ payload: new Date(), type: "timeFinished/set" });
      bell?.start();
      wakeLock?.disable();
    });
    return () => void (abort = true);
  }, [
    bell,
    localState.isDimmerEnabled,
    timerDurationInSeconds,
    localState.timerState,
    wakeLock,
  ]);

  useBeforeUnload(useCallback((e) => e.preventDefault(), []));

  if (!searchParams.has(MEDITATION_SEARCH_PARAM_TIME_KEY)) {
    navigate("/");
    return;
  }

  return (
    <>
      <MeditationTimerPresentation
        dimmed={localState.isDimmerEnabled}
        onDim={onDim}
        onDontLog={onDontLog}
        onFinish={onFinish}
        onPause={onPause}
        onPlay={onPlay}
        onLog={onLog}
        onUndim={onUndim}
        roundedSecondsRemaining={roundedSecondsRemaining}
        timerState={localState.timerState}
        totalSeconds={timerDurationInSeconds}
      />
      <LogMeditationDialog
        onClose={onCloseDialog}
        onDontLog={onDontLog}
        onLog={onLog}
        open={localState.isDialogOpen}
        secondsMeditated={secondsMeditated}
        timerDurationInSeconds={timerDurationInSeconds}
      />
    </>
  );
}
