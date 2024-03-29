import { ChangePasswordPage } from "eri";
import { ERRORS } from "../../../constants";
import { createAuthenticatedUserAndSession } from "../../../cognito";
import { useSelector } from "react-redux";
import userSlice from "../../../store/userSlice";

export default function ChangePassword() {
  const email = useSelector(userSlice.selectors.email);

  if (!email) throw Error("User email not defined");

  return (
    <ChangePasswordPage
      onSubmit={async ({ currentPassword, newPassword, setSubmitError }) => {
        try {
          const { cognitoUser } = await createAuthenticatedUserAndSession(
            email,
            currentPassword,
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
                    setSubmitError(ERRORS.generic);
                }
                return reject(JSON.stringify(e));
              },
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
              setSubmitError(ERRORS.generic);
          }
          throw Error(JSON.stringify(e));
        }
      }}
    />
  );
}
