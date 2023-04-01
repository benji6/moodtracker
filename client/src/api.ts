import {
  LocationClient,
  SearchPlaceIndexForPositionCommand,
} from "@aws-sdk/client-location";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { getIdToken } from "./cognito";
import { AWS_CONSTANTS, TIME } from "./constants";
import { AppEvent, Usage, WeatherApiResponse } from "./types";

const API_URI = "/api";
const EVENTS_URI = `${API_URI}/events`;
const USAGE_URI = `${API_URI}/usage`;
const WEATHER_URI = `${API_URI}/weather`;
const WEEKLY_EMAILS_URI = `${API_URI}/weekly-emails`;

const fetchWithAuth: typeof fetch = async (
  input: RequestInfo | URL,
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

const fetchWithRetry: typeof fetch = async (
  input: RequestInfo | URL,
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

const fetchWithAuthAndRetry: typeof fetch = async (
  input: RequestInfo | URL,
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

const getUnixTimestampRoundedToNearestHourAndInPast = (date: Date) => {
  const roundedTime =
    Math.round(date.getTime() / 1e3 / TIME.secondsPerHour) *
    TIME.secondsPerHour;
  return (
    roundedTime - (roundedTime > Date.now() / 1e3 ? TIME.secondsPerHour : 0)
  );
};

export const fetchWeather = async ({
  queryKey: [_, { date, latitude, longitude }],
}: {
  queryKey: Readonly<
    ["weather", { date: Date; latitude: number; longitude: number }]
  >;
}): Promise<WeatherApiResponse> => {
  // Rounding latitude and longitude to 1 decimal place is required by the API and gives a resolution of about 10km (https://en.wikipedia.org/wiki/Decimal_degrees#Precision). More detail in API code
  const response = await fetchWithAuth(
    `${WEATHER_URI}?lat=${latitude.toFixed(1)}&lon=${longitude.toFixed(1)}&t=${
      // Date is rounded to the nearest hour, although finer resolution is likely available from many stations. The rounding should increase feasibility of caching on the backend
      getUnixTimestampRoundedToNearestHourAndInPast(date)
    }`
  );
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};

export const eventsGet = async (
  cursor?: string
): Promise<{
  events: AppEvent[];
  hasNextPage: boolean;
  nextCursor: string;
}> => {
  const response = await fetchWithAuthAndRetry(
    cursor ? `${EVENTS_URI}/?cursor=${encodeURIComponent(cursor)}` : EVENTS_URI
  );
  if (!response.ok) throw Error(String(response.status));
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

// Below are used with react-query which handles retries
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
  const response = await fetchWithRetry(USAGE_URI);
  if (!response.ok) throw Error(String(response.status));
  const usage = await response.json();
  return {
    expires: new Date(response.headers.get("expires")!),
    usage,
  };
};

export const getReverseGeolocation = async ({
  queryKey: [_, { latitude, longitude }],
}: {
  queryKey: Readonly<
    ["reverse-geolocation", { latitude: number; longitude: number }]
  >;
}) => {
  const idToken = await getIdToken();
  const locationClient = new LocationClient({
    region: AWS_CONSTANTS.region,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: AWS_CONSTANTS.region },
      identityPoolId: AWS_CONSTANTS.cognitoIdentityPoolId,
      logins: {
        [`cognito-idp.${AWS_CONSTANTS.region}.amazonaws.com/${AWS_CONSTANTS.cognitoUserPoolId}`]:
          idToken.getJwtToken(),
      },
    }),
  });
  return locationClient.send(
    new SearchPlaceIndexForPositionCommand({
      IndexName: "MoodTrackerPlaceIndex",
      Language: "en-GB",
      MaxResults: 1,
      Position: [longitude, latitude],
    })
  );
};
