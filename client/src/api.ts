import { getIdToken } from "./cognito";
import { AppEvent } from "./types";

const eventsUrl =
  "https://0q11376u8l.execute-api.us-east-1.amazonaws.com/prod/events";

const getAuthorizationHeader = async () => {
  const idToken = await getIdToken();
  return `Bearer ${idToken.getJwtToken()}`;
};

export const getEvents = async (): Promise<AppEvent[]> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(eventsUrl, {
    headers: { Authorization },
  });
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};

export const postEvents = async (events: AppEvent[]): Promise<void> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(eventsUrl, {
    body: JSON.stringify(events),
    headers: { Authorization, "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) throw Error(String(response.status));
};
