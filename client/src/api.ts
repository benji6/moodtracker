import { AppEvent, Usage, WeatherApiResponse } from "./types";
import {
  LocationClient,
  SearchPlaceIndexForPositionCommand,
} from "@aws-sdk/client-location";
import { addMinutes, subMinutes } from "date-fns";
import { AWS_CONSTANTS } from "./constants";
import { captureException } from "./sentry";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { getIdToken } from "./cognito";

const API_URI = "/api";
const EVENTS_URI = `${API_URI}/events`;
const USAGE_URI = `${API_URI}/usage`;
const WEATHER_URI = `${API_URI}/weather`;
const WEB_PUSH_TOKENS_URI = `${API_URI}/web-push-tokens`;
const WEEKLY_EMAILS_URI = `${API_URI}/weekly-emails`;

const fetchWithAuth = async (
  input: string,
  init?: RequestInit,
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

const fetchWithRetry = async (
  input: string,
  init?: RequestInit,
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

const fetchWithAuthAndRetry = async (
  input: string,
  init?: RequestInit,
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

export const fetchWeather = async ({
  queryKey: [_, { date, latitude, longitude }],
}: {
  queryKey: Readonly<
    ["weather", { date: number; latitude: string; longitude: string }]
  >;
}): Promise<WeatherApiResponse> => {
  const response = await fetchWithAuth(
    `${WEATHER_URI}?lat=${latitude}&lon=${longitude}&t=${date}`,
  );
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};

// events queries do not use react-query so they are made with retry
export const eventsGet = async (
  cursor?: string,
): Promise<{
  events: AppEvent[];
  hasNextPage: boolean;
  nextCursor: string;
}> => {
  const response = await fetchWithAuthAndRetry(
    cursor ? `${EVENTS_URI}/?cursor=${encodeURIComponent(cursor)}` : EVENTS_URI,
  );
  if (!response.ok) {
    const error = { body: undefined, status: response.status };
    try {
      error.body = await response.json();
    } catch (e) {
      captureException(e);
    }
    throw Error(JSON.stringify(error));
  }
  return response.json();
};
export const eventsPost = async (events: AppEvent[]): Promise<void> => {
  const response = await fetchWithAuthAndRetry(EVENTS_URI, {
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

export const usageGet = async (): Promise<{ expires: Date; usage: Usage }> => {
  const response = await fetch(USAGE_URI);
  if (!response.ok) throw Error(String(response.status));
  const usage = await response.json();
  return {
    expires: new Date(response.headers.get("expires")!),
    usage,
  };
};

export const webPushTokensList = async (): Promise<{
  tokens: {
    createdAt: string;
    token: string;
    updatedAt: string;
  }[];
}> => {
  const response = await fetchWithAuth(WEB_PUSH_TOKENS_URI);
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};
export const webPushTokensDelete = async (token: string): Promise<void> => {
  const response = await fetchWithAuth(
    `${WEB_PUSH_TOKENS_URI}/${encodeURIComponent(token)}`,
    { method: "DELETE" },
  );
  if (!response.ok) throw Error(String(response.status));
};
export const webPushTokensPut = async (tokenObject: {
  createdAt: string;
  token: string;
  updatedAt: string;
}): Promise<{
  createdAt: string;
  token: string;
  updatedAt: string;
}> => {
  const { token, ...body } = tokenObject;
  const response = await fetchWithAuth(
    `${WEB_PUSH_TOKENS_URI}/${encodeURIComponent(token)}`,
    {
      body: JSON.stringify(body),
      method: "PUT",
    },
  );
  if (!response.ok) throw Error(String(response.status));
  return tokenObject;
};

const getLocationClient = (() => {
  let cachedLocationClient: Promise<LocationClient>;
  let state: "NEVER_CALLED" | "SETTLED" | "IN_FLIGHT" = "NEVER_CALLED";
  let expiresAt = new Date(0);

  return async (): Promise<LocationClient> => {
    const now = new Date();
    if (state === "IN_FLIGHT" || (state === "SETTLED" && now < expiresAt))
      return cachedLocationClient;
    cachedLocationClient = new Promise((resolve) => {
      getIdToken().then((idToken) => {
        const idTokenExpiresAt = subMinutes(
          new Date(idToken.getExpiration() * 1e3),
          5,
        );
        // Will expire after an hour, we use 55 minutes out of an abundance of caution
        const locationClientExpiresAt = addMinutes(now, 55);
        expiresAt =
          idTokenExpiresAt < locationClientExpiresAt
            ? idTokenExpiresAt
            : locationClientExpiresAt;
        resolve(
          new LocationClient({
            region: AWS_CONSTANTS.region,
            credentials: fromCognitoIdentityPool({
              clientConfig: { region: AWS_CONSTANTS.region },
              identityPoolId: AWS_CONSTANTS.cognitoIdentityPoolId,
              logins: {
                [`cognito-idp.${AWS_CONSTANTS.region}.amazonaws.com/${AWS_CONSTANTS.cognitoUserPoolId}`]:
                  idToken.getJwtToken(),
              },
            }),
          }),
        );
        state = "SETTLED";
      });
    });
    state = "IN_FLIGHT";
    return cachedLocationClient;
  };
})();

export const getReverseGeolocation = async ({
  queryKey: [_, { latitude, longitude }],
}: {
  queryKey: Readonly<
    ["reverse-geolocation", { latitude: number; longitude: number }]
  >;
}) => {
  const locationClient = await getLocationClient();
  return locationClient.send(
    new SearchPlaceIndexForPositionCommand({
      IndexName: "MoodTrackerPlaceIndex",
      Language: "en-GB",
      MaxResults: 1,
      Position: [longitude, latitude],
    }),
  );
};
