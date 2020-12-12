import { Link, useNavigate, RouteComponentProps } from "@reach/router";
import { SignInPage } from "eri";
import * as React from "react";
import { useDispatch } from "react-redux";
import { createAuthenticatedUserAndSession } from "../../cognito";
import { NETWORK_ERROR_MESSAGE } from "../../constants";
import userSlice from "../../store/userSlice";
import useRedirectAuthed from "../hooks/useRedirectAuthed";

// The properties declared here are by no means exhaustive
interface TokenPayload {
  email: string;
  sub: string;
}

export default function SignIn(_: RouteComponentProps) {
  useRedirectAuthed();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <SignInPage
      onSubmit={async ({ email, password, setSubmitError }) => {
        try {
          const {
            cognitoUserSession,
          } = await createAuthenticatedUserAndSession(email, password);
          const { email: tokenEmail, sub: id } = cognitoUserSession.getIdToken()
            .payload as TokenPayload;
          dispatch(userSlice.actions.set({ email: tokenEmail, id }));
          navigate("/");
        } catch (e) {
          switch (e.code) {
            case "NetworkError":
              return setSubmitError(NETWORK_ERROR_MESSAGE);
            case "UserNotConfirmedException":
              return setSubmitError(
                <>
                  Check your email to verify your email address or{" "}
                  <Link to="/resend-verification">
                    resend the verification email
                  </Link>
                </>
              );

            case "NotAuthorizedException":
              return setSubmitError("Incorrect email/password");
            default:
              setSubmitError(
                "Something went wrong, check the data you have entered and try again"
              );
          }
        }
      }}
    />
  );
}
