import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";
import useInterval from "./useInterval";
import { putMoods } from "../../api";

const SYNC_INTERVAL = 6e4;

export default function useMoods() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = React.useState(false);

  React.useEffect(
    () =>
      void (async () => {
        try {
          await Promise.all([
            storage.getMoods(undefined).then((moods) => {
              if (moods) dispatch({ type: "moods/set", payload: moods });
            }),
            storage.getCreatedMoodIds(undefined).then((createdMoodIds) => {
              if (createdMoodIds)
                dispatch({
                  type: "createdMoodIds/set",
                  payload: createdMoodIds,
                });
            }),
          ]);
        } finally {
          setIsLoadedFromStorage(true);
        }
      })(),
    []
  );

  React.useEffect(() => {
    if (!isLoadedFromStorage) return;
    storage.setCreatedMoodIds(undefined, state.createdMoodsIds);
  }, [isLoadedFromStorage, state.createdMoodsIds]);

  React.useEffect(() => {
    if (!isLoadedFromStorage) return;
    storage.setMoods(undefined, state.moods);
  }, [isLoadedFromStorage, state.moods]);

  const syncToServer = () =>
    void (async () => {
      if (
        !isLoadedFromStorage ||
        !state.userEmail ||
        !state.createdMoodsIds.length
      )
        return;
      const moods = state.moods.filter((mood) =>
        state.createdMoodsIds.includes(mood.createdAt)
      );
      dispatch({ type: "syncToServer/start" });
      try {
        await putMoods(moods);
        dispatch({ type: "syncToServer/success" });
      } catch {
        dispatch({ type: "syncToServer/error" });
      }
    })();

  React.useEffect(syncToServer, [
    isLoadedFromStorage,
    state.createdMoodsIds,
    state.moods,
    state.userEmail,
  ]);
  useInterval(syncToServer, SYNC_INTERVAL);
}
