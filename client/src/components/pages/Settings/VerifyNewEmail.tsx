import { Button, Paper, TextField } from "eri";
import { FormEvent, ReactNode, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { refreshSession, verifyNewEmail } from "../../../cognito";
import { ERRORS } from "../../../constants";
import { NEW_EMAIL_SEARCH_PARAM_KEY } from "./constants";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import userSlice from "../../../store/userSlice";

export default function VerifyNewEmail() {
  const dispatch = useDispatch();
  const [fieldError, setFieldError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);
  const currentEmailAddress = useSelector(userSlice.selectors.email);
  const [submitError, setSubmitError] = useState<ReactNode>();
  const newEmail = searchParams.get(NEW_EMAIL_SEARCH_PARAM_KEY);

  return (
    <Paper.Group>
      <Paper>
        {successfullyUpdated ? (
          <>
            <h2>Email address successfully updated!</h2>
            <p>Your new email address is &quot;{currentEmailAddress}&quot;.</p>
            <p>
              Please use your new email address to sign in next time.{" "}
              <b>Your old email address will no longer work.</b>
            </p>
            <p>
              <Link to="/">Click here to go to your homepage</Link>.
            </p>
          </>
        ) : (
          <>
            <h2>Verify new email address</h2>
            {newEmail && (
              <p>
                We&apos;ve sent a verification code to &quot;{newEmail}&quot;.
              </p>
            )}
            <p>
              Please note that once you have verified your new email address you
              will be logged out and will need to sign in with your new email
              address.
            </p>
            <p>
              <b>
                You will no longer be able to log in with your old email
                address.
              </b>
            </p>
            <form
              noValidate
              onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                setFieldError(undefined);
                setSubmitError(undefined);
                const field = (e.target as HTMLFormElement).verification;
                if (field.validity.valueMissing)
                  return setFieldError(ERRORS.required);

                setIsSubmitting(true);
                try {
                  await verifyNewEmail(field.value);
                  const session = await refreshSession();
                  const idToken = session.getIdToken();
                  dispatch(userSlice.actions.setEmail(idToken.payload.email));
                  setSuccessfullyUpdated(true);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e: any) {
                  switch (e.code) {
                    case "CodeMismatchException":
                      setSubmitError(
                        "The code you've provided is incorrect, please try again",
                      );
                      break;
                    case "ExpiredCodeException":
                      setSubmitError(
                        <>
                          The code you&apos;ve provided has expired, please try{" "}
                          <Link to="/settings/change-email">
                            changing your email
                          </Link>{" "}
                          again
                        </>,
                      );
                      break;
                    case "NetworkError":
                      setSubmitError(ERRORS.network);
                      break;
                    default:
                      setSubmitError(ERRORS.generic);
                  }
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <TextField
                autoComplete="off"
                autoFocus
                error={fieldError}
                label="Verification code"
                supportiveText="Check the inbox and junk folder of your new email address for the code we sent you"
                name="verification"
                type="text"
              />
              {submitError && (
                <p className="center">
                  <small className="negative">{submitError}</small>
                </p>
              )}
              <Button.Group>
                <Button disabled={isSubmitting}>
                  Verify new email address
                </Button>
              </Button.Group>
              <p className="center">
                <small>
                  If you cannot find your verification code try{" "}
                  <Link to="/settings/change-email">changing your email</Link>{" "}
                  again.
                </small>
              </p>
            </form>
          </>
        )}
      </Paper>
    </Paper.Group>
  );
}
