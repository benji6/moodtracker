import { ResendVerificationPage } from "eri";
import { useNavigate } from "@reach/router";
import * as React from "react";
import { createCognitoUser } from "../../cognito";
import { NETWORK_ERROR_MESSAGE } from "../../constants";

const resendConfirmation = ({ email }: { email: string }) =>
  new Promise((resolve, reject) => {
    createCognitoUser(email).resendConfirmationCode((err, result) =>
      err ? reject(err) : resolve(result)
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
        } catch (e) {
          switch (e.code) {
            case "NetworkError":
              setSubmitError(NETWORK_ERROR_MESSAGE);
              break;
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
