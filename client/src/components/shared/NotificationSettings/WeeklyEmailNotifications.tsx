import { ERRORS, QUERY_KEYS } from "../../../constants";
import { Spinner, Toggle } from "eri";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  weeklyEmailsDisable,
  weeklyEmailsEnable,
  weeklyEmailsGet,
} from "../../../api";
import { queryClient } from "../../..";

export default function WeeklyEmailNotifications() {
  const { data, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.weeklyEmails],
    queryFn: weeklyEmailsGet,
  });

  const mutation = useMutation({
    mutationFn: (isEnabled: boolean) =>
      isEnabled ? weeklyEmailsDisable() : weeklyEmailsEnable(),
    onSuccess: () => {
      queryClient.setQueryData<typeof data>(
        [QUERY_KEYS.weeklyEmails],
        (isEnabled) => !isEnabled,
      );
    },
  });

  return (
    <>
      <h3>Weekly email updates</h3>
      <p>
        Opt in to receive an email update every Monday morning with your own
        personal weekly mood report.
      </p>
      <Toggle
        checked={Boolean(data)}
        disabled={mutation.isPending || isPending}
        error={mutation.isError || isError ? ERRORS.network : undefined}
        onChange={() => mutation.mutate(Boolean(data))}
        label={
          mutation.isPending || isPending ? (
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
