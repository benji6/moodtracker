import { RouteComponentProps } from "@reach/router";
import { ResetPasswordPage, Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { createCognitoUser } from "../../cognito";
import { NETWORK_ERROR_MESSAGE } from "../../constants";
import { appIsStorageLoadingSelector } from "../../selectors";
import useRedirectAuthed from "../hooks/useRedirectAuthed";

export default function ResetPassword(_: RouteComponentProps) {
  useRedirectAuthed();
  if (useSelector(appIsStorageLoadingSelector)) return <Spinner />;

  return (
    <ResetPasswordPage
      onSubmit={async ({ code, email, password, setSubmitError }) =>
        new Promise((resolve, reject) => {
          createCognitoUser(email).confirmPassword(code, password, {
            onSuccess: resolve,

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onFailure: (e: any) => {
              switch (e.code) {
                case "CodeMismatchException":
                  setSubmitError(
                    "Incorrect verification code, check the data you have entered and try again"
                  );
                  break;
                case "ExpiredCodeException":
                  setSubmitError(
                    "This verification code has expired, please request another one and try again"
                  );
                  break;
                case "NetworkError":
                  setSubmitError(NETWORK_ERROR_MESSAGE);
                  break;
                default:
                  setSubmitError(
                    "Something went wrong, check the data you have entered and try again"
                  );
              }
              reject(JSON.stringify(e));
            },
          });
        })
      }
    />
  );
}
