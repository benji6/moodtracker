import { ERRORS } from "../../constants";
import { ForgotPasswordPage } from "eri";
import { createCognitoUser } from "../../cognito";

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
                  setSubmitError(ERRORS.network);
                  break;
                default:
                  setSubmitError(ERRORS.generic);
              }
              reject(Error(JSON.stringify(e)));
            },
          });
        })
      }
    />
  );
}
