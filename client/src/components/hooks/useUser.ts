import * as React from "react";
import { getIdToken } from "../../cognito";
import { DispatchContext } from "../AppState";
import storage from "../../storage";
import { useDispatch } from "react-redux";
import userSlice from "../../store/userSlice";

export default function useUser(): void {
  const appDispatch = React.useContext(DispatchContext);
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
          if (e.message === "No current user") {
            dispatch(userSlice.actions.clear());
            appDispatch({ type: "app/signOut" });
          }
        }
      })(),
    []
  );
}
