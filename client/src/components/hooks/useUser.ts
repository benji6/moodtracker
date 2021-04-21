import * as React from "react";
import { getIdToken } from "../../cognito";
import storage from "../../storage";
import { useDispatch } from "react-redux";
import userSlice from "../../store/userSlice";
import eventsSlice from "../../store/eventsSlice";

export default function useUser(): void {
  const dispatch = useDispatch();

  React.useEffect(
    () =>
      void (async () => {
        try {
          const storedUser = await storage.getUser();
          if (storedUser) dispatch(userSlice.actions.set(storedUser));
          const idToken = await getIdToken();
          if (
            !storedUser ||
            storedUser.email !== idToken.payload.email ||
            storedUser.id !== idToken.payload.sub
          )
            dispatch(
              userSlice.actions.set({
                email: idToken.payload.email,
                id: idToken.payload.sub,
              })
            );
        } catch (e) {
          dispatch(userSlice.actions.clear());
          dispatch(eventsSlice.actions.clear());
        }
      })(),
    [dispatch]
  );
}
