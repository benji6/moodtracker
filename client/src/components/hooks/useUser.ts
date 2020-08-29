import { navigate } from "@reach/router";
import * as React from "react";
import { getIdToken } from "../../cognito";
import { DispatchContext } from "../AppState";
import storage from "../../storage";

export default function useUser(): void {
  const dispatch = React.useContext(DispatchContext);

  React.useEffect(
    () =>
      void (async () => {
        try {
          const storedUser = await storage.getUser();
          if (storedUser) dispatch({ type: "user/set", payload: storedUser });
          const idToken = await getIdToken();
          if (
            !storedUser ||
            storedUser.email !== idToken.payload.email ||
            storedUser.id !== idToken.payload.sub
          )
            dispatch({
              type: "user/set",
              payload: {
                email: idToken.payload.email,
                id: idToken.payload.sub,
              },
            });
        } catch (e) {
          if (e.message === "No current user") {
            dispatch({ type: "app/signOut" });
            navigate("/");
          }
        }
      })(),
    []
  );
}
