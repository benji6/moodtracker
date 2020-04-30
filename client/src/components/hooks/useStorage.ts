import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";

export default function useStorage() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);

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
          dispatch({ type: "storage/loaded" });
        }
      })(),
    []
  );

  React.useEffect(() => {
    if (state.isStorageLoading) return;
    storage.setCreatedMoodIds(undefined, state.createdMoodsIds);
  }, [state.isStorageLoading, state.createdMoodsIds]);

  React.useEffect(() => {
    if (state.isStorageLoading) return;
    storage.setDeletedMoodIds(undefined, state.deletedMoodsIds);
  }, [state.isStorageLoading, state.deletedMoodsIds]);

  React.useEffect(() => {
    if (state.isStorageLoading) return;
    storage.setMoods(undefined, state.moods);
  }, [state.isStorageLoading, state.moods]);
}
