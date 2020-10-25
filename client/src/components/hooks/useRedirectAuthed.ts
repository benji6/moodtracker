import { useNavigate } from "@reach/router";
import * as React from "react";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../../selectors";

export default function useRedirectAuthed() {
  const navigate = useNavigate();
  const userIsSignedIn = useSelector(userIsSignedInSelector);

  React.useEffect(() => {
    if (userIsSignedIn) navigate("/");
  }, []);
}
