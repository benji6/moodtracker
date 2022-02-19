import { getIdToken } from "./cognito";
import { AppEvent, Settings, Usage } from "./types";

const API_URI = "/api";
const EVENTS_URI = `${API_URI}/events`;
const SETTINGS_URI = `${API_URI}/settings`;
const USAGE_URI = `${API_URI}/usage`;
const WEEKLY_EMAILS_URI = `${API_URI}/weekly-emails`;

const fetchWithRetry: typeof fetch = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  let retriesLeft = 3;
  let response = await fetch(input, init);
  do {
    if (response.status !== 429) break;
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    response = await fetch(input, init);
  } while (--retriesLeft);
  return response;
};

const fetchWithAuth: typeof fetch = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const idToken = await getIdToken();
  return fetchWithRetry(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${idToken.getJwtToken()}`,
    },
  });
};

export const eventsGet = async (
  cursor?: string
): Promise<{
  events: AppEvent[];
  hasNextPage: boolean;
  nextCursor: string;
}> => {
  const response = await fetchWithAuth(
    cursor ? `${EVENTS_URI}/?cursor=${encodeURIComponent(cursor)}` : EVENTS_URI
  );
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};
export const eventsPost = async (events: AppEvent[]): Promise<void> => {
  const response = await fetchWithAuth(EVENTS_URI, {
    body: JSON.stringify(events),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) throw Error(String(response.status));
};

export const weeklyEmailsGet = async (): Promise<boolean> => {
  const response = await fetchWithAuth(WEEKLY_EMAILS_URI);
  if (response.status === 404) return false;
  if (!response.ok) throw Error(String(response.status));
  return true;
};
export const weeklyEmailsDisable = async (): Promise<void> => {
  const response = await fetchWithAuth(WEEKLY_EMAILS_URI, {
    method: "DELETE",
  });
  if (!response.ok) throw Error(String(response.status));
};
export const weeklyEmailsEnable = async (): Promise<void> => {
  const response = await fetchWithAuth(WEEKLY_EMAILS_URI, {
    method: "POST",
  });
  if (!response.ok) throw Error(String(response.status));
};

export const settingsGet = async (): Promise<Settings | undefined> => {
  const response = await fetchWithAuth(SETTINGS_URI);
  if (response.status === 404) return undefined;
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};
export const settingsSet = async (settings: Settings): Promise<void> => {
  const response = await fetchWithAuth(SETTINGS_URI, {
    method: "PUT",
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw Error(String(response.status));
};

export const usageGet = async (): Promise<Usage> => {
  const response = await fetchWithRetry(USAGE_URI);
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};
