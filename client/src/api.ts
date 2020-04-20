import { apiUri } from "./constants";
import { getIdToken } from "./cognito";
import { Mood } from "./types";

const getAuthorizationHeader = async () => {
  const idToken = await getIdToken();
  return `Bearer ${idToken.getJwtToken()}`;
};

export const getMoods = async (): Promise<Mood[]> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(`${apiUri}/moods`, {
    headers: { Authorization },
  });
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};

export const putMoods = async (moods: Mood[]): Promise<void> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(`${apiUri}/moods`, {
    body: JSON.stringify(moods),
    headers: { Authorization, "Content-Type": "application/json" },
    method: "PUT",
  });
  if (!response.ok) throw Error(String(response.status));
};
