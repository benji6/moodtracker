import { getIdToken } from "./cognito";
import { AppEvent } from "./types";

const API_URL = "https://moodtracker.link/api";
const EVENTS_URL = `${API_URL}/events`;
const WEEKLY_EMAILS_URL = `${API_URL}/weekly-emails`;

const fetchWithAuth: typeof fetch = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const idToken = await getIdToken();
  return fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${idToken.getJwtToken()}`,
    },
  });
};

export const getEvents = async (
  cursor?: string
): Promise<{
  events: AppEvent[];
  hasNextPage: boolean;
  nextCursor: string;
}> => {
  const response = await fetchWithAuth(
    cursor ? `${EVENTS_URL}/?cursor=${encodeURIComponent(cursor)}` : EVENTS_URL
  );
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};

export const getWeeklyEmails = async (): Promise<boolean> => {
  const response = await fetchWithAuth(WEEKLY_EMAILS_URL);
  if (response.status === 404) return false;
  if (!response.ok) throw Error(String(response.status));
  return true;
};

export const disableWeeklyEmails = async (): Promise<void> => {
  const response = await fetchWithAuth(WEEKLY_EMAILS_URL, {
    method: "DELETE",
  });
  if (!response.ok) throw Error(String(response.status));
};

export const enableWeeklyEmails = async (): Promise<void> => {
  const response = await fetchWithAuth(WEEKLY_EMAILS_URL, {
    method: "POST",
  });
  if (!response.ok) throw Error(String(response.status));
};

export const postEvents = async (events: AppEvent[]): Promise<void> => {
  const response = await fetchWithAuth(EVENTS_URL, {
    body: JSON.stringify(events),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) throw Error(String(response.status));
};
