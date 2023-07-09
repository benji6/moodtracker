import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner, Toggle } from "eri";
import { queryClient } from "../../..";
import {
  weeklyEmailsDisable,
  weeklyEmailsEnable,
  weeklyEmailsGet,
} from "../../../api";
import { ERRORS } from "../../../constants";

export default function WeeklyEmailNotifications() {
  const { data, isError, isLoading } = useQuery(
    ["weekly-emails"],
    weeklyEmailsGet
  );

  const mutation = useMutation(
    (isEnabled: boolean) =>
      isEnabled ? weeklyEmailsDisable() : weeklyEmailsEnable(),
    {
      onSuccess: () => {
        queryClient.setQueryData<typeof data>(
          ["weekly-emails"],
          (isEnabled) => !isEnabled
        );
      },
    }
  );

  return (
    <>
      <h3>Weekly email updates</h3>
      <p>
        Opt in to receive an email update every Monday morning with your own
        personal weekly mood report.
      </p>
      <Toggle
        checked={Boolean(data)}
        disabled={mutation.isLoading || isLoading}
        error={mutation.isError || isError ? ERRORS.network : undefined}
        onChange={() => mutation.mutate(Boolean(data))}
        label={
          mutation.isLoading || isLoading ? (
            <span>
              <Spinner inline />
            </span>
          ) : (
            `Weekly email notifications ${data ? "en" : "dis"}abled`
          )
        }
      />
    </>
  );
}
