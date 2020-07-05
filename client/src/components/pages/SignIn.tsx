import { RouteComponentProps, Link, NavigateFn } from "@reach/router";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { SignInPage } from "eri";
import * as React from "react";
import { userPool } from "../../cognito";
import { networkErrorMessage } from "../../constants";
import { DispatchContext } from "../AppState";
import useRedirectAuthed from "../hooks/useRedirectAuthed";

const authenticate = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<CognitoUserSession> => {
  const authenticationDetails = new AuthenticationDetails({
    Password: password,
    Username: email,
  });

  const cognitoUser = new CognitoUser({
    Pool: userPool,
    Username: email,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onFailure: reject,
      onSuccess: resolve,
    });
  });
};

export default function SignIn({ navigate }: RouteComponentProps) {
  useRedirectAuthed();
  const dispatch = React.useContext(DispatchContext);
  return (
    <SignInPage
      onSubmit={async ({ email, password, setSubmitError }) => {
        try {
          const result = await authenticate({ email, password });
          dispatch({
            type: "user/set",
            payload: result.getIdToken().payload.email,
          });
          (navigate as NavigateFn)("/");
        } catch (e) {
          switch (e.code) {
            case "NetworkError":
              return setSubmitError(networkErrorMessage);
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
