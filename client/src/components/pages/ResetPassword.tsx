import { ERRORS, TEST_IDS } from "../../constants";
import { ResetPasswordPage } from "eri";
import { createCognitoUser } from "../../cognito";

export default function ResetPassword() {
  return (
    <ResetPasswordPage
      data-test-id={TEST_IDS.resetPasswordPage}
      onSubmit={async ({ code, email, password, setSubmitError }) =>
        new Promise((resolve, reject) => {
          createCognitoUser(email).confirmPassword(code, password, {
            onSuccess: () => resolve(),

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onFailure: (e: any) => {
              switch (e.code) {
                case "CodeMismatchException":
                  setSubmitError(
                    "Incorrect verification code, check the data you have entered and try again",
                  );
                  break;
                case "ExpiredCodeException":
                  setSubmitError(
                    "This verification code has expired, please request another one and try again",
                  );
                  break;
                case "NetworkError":
                  setSubmitError(ERRORS.network);
                  break;
                default:
                  setSubmitError(ERRORS.generic);
              }
              reject(JSON.stringify(e));
            },
          });
        })
      }
    />
  );
}
