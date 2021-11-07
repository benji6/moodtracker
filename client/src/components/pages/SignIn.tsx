import { Link, useNavigate } from "@reach/router";
import { SignInPage } from "eri";
import { useDispatch } from "react-redux";
import { createAuthenticatedUserAndSession } from "../../cognito";
import { ERRORS } from "../../constants";
import userSlice from "../../store/userSlice";

// The properties declared here are by no means exhaustive
interface TokenPayload {
  email: string;
  sub: string;
}

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <SignInPage
      onSubmit={async ({ email, password, setSubmitError }) => {
        try {
          const { cognitoUserSession } =
            await createAuthenticatedUserAndSession(email, password);
          const { email: tokenEmail, sub: id } = cognitoUserSession.getIdToken()
            .payload as TokenPayload;
          dispatch(userSlice.actions.set({ email: tokenEmail, id }));
          navigate("/");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          switch (e.code) {
            case "NetworkError":
              return setSubmitError(ERRORS.network);
            case "UserNotConfirmedException":
              return setSubmitError(
                <>
                  Check your email to verify your email address or{" "}
                  <Link to="/resend-verification">
                    resend the verification email
                  </Link>
                </>
              );

            case "NotAuthorizedException":
              return setSubmitError("Incorrect email/password");
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
