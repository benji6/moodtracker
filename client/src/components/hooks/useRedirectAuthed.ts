import { navigate } from "@reach/router";
import * as React from "react";
import { StateContext } from "../AppState";

export default function useRedirectAuthed() {
  const { userEmail } = React.useContext(StateContext);
  React.useEffect(() => {
    if (userEmail) navigate("/");
  }, []);
}
