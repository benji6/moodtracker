import { ERRORS } from "../../constants";
import { ResendVerificationPage } from "eri";
import { createCognitoUser } from "../../cognito";
import { useNavigate } from "react-router-dom";

const resendConfirmation = ({ email }: { email: string }) =>
  new Promise((resolve, reject) => {
    createCognitoUser(email).resendConfirmationCode((err, result) =>
      err ? reject(err) : resolve(result),
    );
  });

export default function ResendVerification() {
  const navigate = useNavigate();

  return (
    <ResendVerificationPage
      onSubmit={async ({ email, setSubmitError }) => {
        try {
          await resendConfirmation({ email });
          navigate("/verify");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          switch (e.code) {
            case "NetworkError":
              setSubmitError(ERRORS.network);
              break;
            default:
              setSubmitError(ERRORS.generic);
          }
        }
      }}
    />
  );
}
