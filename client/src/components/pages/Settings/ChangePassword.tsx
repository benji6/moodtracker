import { ChangePasswordPage } from "eri";
import { useSelector } from "react-redux";
import { createAuthenticatedUserAndSession } from "../../../cognito";
import { ERRORS } from "../../../constants";
import { userEmailSelector } from "../../../selectors";

export default function ChangePassword() {
  const email = useSelector(userEmailSelector)!;

  return (
    <ChangePasswordPage
      onSubmit={async ({ currentPassword, newPassword, setSubmitError }) => {
        try {
          const { cognitoUser } = await createAuthenticatedUserAndSession(
            email,
            currentPassword
          );
          return new Promise((resolve, reject) => {
            cognitoUser.changePassword(
              currentPassword,
              newPassword,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (e: any) => {
                if (!e) return resolve();
                switch (e.code) {
                  case "LimitExceededException":
                    setSubmitError("Too many attempts, please try again later");
                    break;
                  case "NetworkError":
                    setSubmitError(ERRORS.network);
                    break;
                  default:
                    setSubmitError(
                      "Something went wrong, check the data you have entered and try again"
                    );
                }
                return reject(JSON.stringify(e));
              }
            );
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          switch (e.code) {
            case "NetworkError":
              setSubmitError(ERRORS.network);
              break;
            case "NotAuthorizedException":
              setSubmitError("Current password is incorrect, please try again");
              break;
            default:
              setSubmitError(
                "Something went wrong, check the data you have entered and try again"
              );
          }
          throw Error(JSON.stringify(e));
        }
      }}
    />
  );
}
