import * as React from "react";
import { getIdToken } from "../../cognito";
import storage from "../../storage";
import { useDispatch } from "react-redux";
import userSlice, { UserDetails } from "../../store/userSlice";
import eventsSlice from "../../store/eventsSlice";

export default function useUser(): void {
  const dispatch = useDispatch();

  React.useEffect(
    () =>
      void (async () => {
        let storedUser: UserDetails | undefined;

        try {
          // Fails in Firefox private browsing
          storedUser = await storage.getUser();
        } catch {
          dispatch(userSlice.actions.clear());
          dispatch(eventsSlice.actions.clear());
          return;
        }

        if (storedUser) dispatch(userSlice.actions.set(storedUser));

        try {
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
          if (e.message !== "No current user") return;
          dispatch(userSlice.actions.clear());
          dispatch(eventsSlice.actions.clear());
        }
      })(),
    [dispatch]
  );
}
