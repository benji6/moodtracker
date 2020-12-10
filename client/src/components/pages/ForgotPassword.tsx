import { RouteComponentProps } from "@reach/router";
import { CognitoUser } from "amazon-cognito-identity-js";
import { ForgotPasswordPage } from "eri";
import * as React from "react";
import { userPool } from "../../cognito";
import { NETWORK_ERROR_MESSAGE } from "../../constants";
import useRedirectAuthed from "../hooks/useRedirectAuthed";

export default function ForgotPassword(_: RouteComponentProps) {
  useRedirectAuthed();

  return (
    <ForgotPasswordPage
      onSubmit={({ email, setSubmitError }) =>
        new Promise((resolve, reject) => {
          const cognitoUser = new CognitoUser({
            Pool: userPool,
            Username: email,
          });
          cognitoUser.forgotPassword({
            inputVerificationCode: resolve,

            // doesn't actually seem to be invoked (inputVerificationCode is called instead)
            // but is marked as required
            onSuccess: resolve,

            // types are wrong for `onFailure`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onFailure: (e: any) => {
              switch (e.code) {
                case "NetworkError":
                  setSubmitError(NETWORK_ERROR_MESSAGE);
                  break;
                default:
                  setSubmitError(
                    "Something went wrong, check the data you have entered and try again"
                  );
              }
              reject(Error(JSON.stringify(e)));
            },
          });
        })
      }
    />
  );
}
