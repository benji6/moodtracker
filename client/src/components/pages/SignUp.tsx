import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { ERRORS } from "../../constants";
import { SignUpPage } from "eri";
import { useNavigate } from "react-router-dom";
import { userPool } from "../../cognito";

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
      (err: Error | void, result) => (err ? reject(err) : resolve(result)),
    );
  });

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <SignUpPage
      onSubmit={async ({ email, password, setSubmitError }) => {
        const attributeList = [
          new CognitoUserAttribute({ Name: "email", Value: email }),
        ];
        try {
          await signUp({ attributeList, email, password });
          navigate("/verify");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          switch (e.code) {
            case "NetworkError":
              setSubmitError(ERRORS.network);
              break;
            case "UsernameExistsException":
              setSubmitError("Username already exists, try signing in instead");
              break;
            default:
              setSubmitError(ERRORS.generic);
          }
        }
      }}
    />
  );
}
