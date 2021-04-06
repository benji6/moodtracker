import { ForgotPasswordPage } from "eri";
import * as React from "react";
import { createCognitoUser } from "../../cognito";
import { NETWORK_ERROR_MESSAGE } from "../../constants";

export default function ForgotPassword() {
  return (
    <ForgotPasswordPage
      onSubmit={({ email, setSubmitError }) =>
        new Promise((resolve, reject) => {
          createCognitoUser(email).forgotPassword({
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
