import { useDispatch, useSelector } from "react-redux";
import {
  useBeforeUnload,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { MEDITATION_SEARCH_PARAM_TIME_KEY } from "../../../../../constants";
import { captureException } from "../../../../../sentry";
import eventsSlice from "../../../../../store/eventsSlice";
import { Meditation } from "../../../../../types";
import useKeyboardEscape from "../../../../hooks/useKeyboardEscape";
import { noSleep } from "../nosleep";
import useBell from "./useBell";
import LogMeditationDialog from "./LogMeditationDialog";
import MeditationTimerPresentation from "./MeditationTimerPresentation";
import { initialState, reducer } from "./reducer";
import { useCallback, useEffect, useReducer, useRef } from "react";
import deviceSlice from "../../../../../store/deviceSlice";

export default function MeditationTimer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [localState, localDispatch] = useReducer(reducer, initialState);
  const bell = useBell();

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
    noSleep.disable();
    localDispatch({ payload: "PAUSED", type: "timerState/set" });
  }, []);
  const onPlay = useCallback(() => {
    noSleep.enable();
    initialTime.current =
      Date.now() + roundedSecondsRemaining * 1e3 - timerDurationInSeconds * 1e3;
    localDispatch({ payload: "TIMING", type: "timerState/set" });
  }, [roundedSecondsRemaining, timerDurationInSeconds]);
  const onReveal = useCallback(
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
    onDontLog();
  }, [
    dispatch,
    geolocation,
    onDontLog,
    localState.timeFinished,
    secondsMeditated,
  ]);

  useKeyboardEscape(() =>
    localDispatch({ payload: false, type: "isDimmerEnabled/set" }),
  );

  useEffect(() => {
    noSleep.enable();
    return () => {
      bell?.stop();
      noSleep.disable();
    };
  }, [bell]);

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
      noSleep.disable();
    });
    return () => void (abort = true);
  }, [
    bell,
    localState.isDimmerEnabled,
    timerDurationInSeconds,
    localState.timerState,
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
        onReveal={onReveal}
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
