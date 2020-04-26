import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";
import useInterval from "./useInterval";
import { deleteMoods, putMoods } from "../../api";

const SYNC_INTERVAL = 6e4;

export default function useMoods() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = React.useState(false);

  React.useEffect(
    () =>
      void (async () => {
        const loadCreatedMoodIds = async (): Promise<void> => {
          const ids = await storage.getCreatedMoodIds(undefined);
          if (ids) dispatch({ type: "createdMoodIds/set", payload: ids });
        };
        const loadDeletedMoodIds = async (): Promise<void> => {
          const ids = await storage.getDeletedMoodIds(undefined);
          if (ids) dispatch({ type: "deletedMoodIds/set", payload: ids });
        };
        const loadMoods = async (): Promise<void> => {
          const moods = await storage.getMoods(undefined);
          if (moods) dispatch({ type: "moods/set", payload: moods });
        };
        try {
          await Promise.all([
            loadCreatedMoodIds(),
            loadDeletedMoodIds(),
            loadMoods(),
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
    storage.setDeletedMoodIds(undefined, state.deletedMoodsIds);
  }, [isLoadedFromStorage, state.deletedMoodsIds]);

  React.useEffect(() => {
    if (!isLoadedFromStorage) return;
    storage.setMoods(undefined, state.moods);
  }, [isLoadedFromStorage, state.moods]);

  const syncToServer = () =>
    void (async () => {
      if (!isLoadedFromStorage || !state.userEmail) return;

      if (state.createdMoodsIds.length)
        void (async () => {
          const newMoods = state.moods.filter((mood) =>
            state.createdMoodsIds.includes(mood.createdAt)
          );
          dispatch({ type: "syncCreatedToServer/start" });
          try {
            await putMoods(newMoods);
            dispatch({ type: "syncCreatedToServer/success" });
          } catch {
            dispatch({ type: "syncCreatedToServer/error" });
          }
        })();

      if (state.deletedMoodsIds.length)
        void (async () => {
          dispatch({ type: "syncDeletedToServer/start" });
          try {
            await deleteMoods(state.deletedMoodsIds);
            dispatch({ type: "syncDeletedToServer/success" });
          } catch {
            dispatch({ type: "syncDeletedToServer/error" });
          }
        })();
    })();

  React.useEffect(syncToServer, [
    isLoadedFromStorage,
    state.createdMoodsIds,
    state.moods,
    state.userEmail,
  ]);
  useInterval(syncToServer, SYNC_INTERVAL);
}
