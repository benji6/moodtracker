import { Button, Paper, TextField } from "eri";
import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeEmail } from "../../../cognito";
import { ERRORS } from "../../../constants";
import { userEmailSelector } from "../../../selectors";
import { NEW_EMAIL_SEARCH_PARAM_KEY } from "./constants";

export default function ChangeEmail() {
  const navigate = useNavigate();
  const currentEmail = useSelector(userEmailSelector)!;
  const [fieldError, setFieldError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  return (
    <Paper.Group>
      <Paper>
        <h2>Change email</h2>
        <p>
          We will send a verification code to the new email address you provide
          us. Your email address will only change when you verify your new email
          address with us.
        </p>
        <form
          noValidate
          onSubmit={async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setFieldError(undefined);
            setSubmitError(undefined);
            const field = (e.target as HTMLFormElement).email;
            const { value } = field;
            if (field.validity.valueMissing)
              return setFieldError(ERRORS.required);
            if (field.validity.typeMismatch)
              return setFieldError("Email address not valid");
            if (value === currentEmail)
              return setFieldError(
                "New email address is the same as your current email address"
              );

            setIsSubmitting(true);
            try {
              await changeEmail(value);
              navigate(
                `/settings/verify-new-email?${NEW_EMAIL_SEARCH_PARAM_KEY}=${value}`
              );
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              switch (e.code) {
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
            autoComplete="email"
            autoFocus
            error={fieldError}
            label="New email address"
            name="email"
            supportiveText={`Your current email address is: ${currentEmail}`}
            type="email"
          />
          {submitError && (
            <p className="center">
              <small className="negative">{submitError}</small>
            </p>
          )}
          <Button.Group>
            <Button disabled={isSubmitting}>Change email</Button>
          </Button.Group>
          <p className="center">
            <small>
              <Link to="/settings/verify-new-email">
                Already have a verification code
              </Link>
              ?
            </small>
          </p>
        </form>
      </Paper>
    </Paper.Group>
  );
}
