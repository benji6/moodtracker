import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { SignUpPage } from "eri";
import { navigate } from "@reach/router";
import * as React from "react";
import { userPool } from "../../cognito";
import { ERRORS } from "../../constants";

const signUp = ({
  attributeList,
  email,
  password,
}: {
  attributeList: CognitoUserAttribute[];
  email: string;
  password: string;
}) =>
  new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      attributeList,
      // mismatch between types and documentation - have gone with docs
      // https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#usage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      null as any,
      (err: Error | void, result) => (err ? reject(err) : resolve(result))
    );
  });

export default function SignUp() {
  return (
    <SignUpPage
      onSubmit={async ({ email, password, setSubmitError }) => {
        const attributeList = [
          new CognitoUserAttribute({ Name: "email", Value: email }),
        ];
        try {
          await signUp({ attributeList, email, password });
          navigate("/verify");
        } catch (e) {
          switch (e.code) {
            case "NetworkError":
              setSubmitError(ERRORS.network);
              break;
            case "UsernameExistsException":
              setSubmitError("Username already exists, try signing in instead");
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
