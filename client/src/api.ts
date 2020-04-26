import { getIdToken } from "./cognito";
import { Mood, Patch } from "./types";

const moodsUrl =
  "https://0q11376u8l.execute-api.us-east-1.amazonaws.com/prod/moods";

const getAuthorizationHeader = async () => {
  const idToken = await getIdToken();
  return `Bearer ${idToken.getJwtToken()}`;
};

export const getMoods = async (): Promise<Mood[]> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(moodsUrl, {
    headers: { Authorization },
  });
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};

export const patchMoods = async (patch: Patch): Promise<void> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(moodsUrl, {
    body: JSON.stringify(patch),
    headers: { Authorization, "Content-Type": "application/json" },
    method: "PATCH",
  });
  if (!response.ok) throw Error(String(response.status));
};
