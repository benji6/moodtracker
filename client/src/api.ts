import { getIdToken } from "./cognito";
import { Mood } from "./types";

const moodsUrl =
  "https://0q11376u8l.execute-api.us-east-1.amazonaws.com/prod/moods";

const getAuthorizationHeader = async () => {
  const idToken = await getIdToken();
  return `Bearer ${idToken.getJwtToken()}`;
};

export const deleteMoods = async (createdAts: string[]): Promise<void> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(moodsUrl, {
    body: JSON.stringify(createdAts),
    headers: { Authorization, "Content-Type": "application/json" },
    method: "DELETE",
  });
  if (!response.ok) throw Error(String(response.status));
};

export const getMoods = async (): Promise<Mood[]> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(moodsUrl, {
    headers: { Authorization },
  });
  if (!response.ok) throw Error(String(response.status));
  return response.json();
};

export const putMoods = async (moods: Mood[]): Promise<void> => {
  const Authorization = await getAuthorizationHeader();
  const response = await fetch(moodsUrl, {
    body: JSON.stringify(moods),
    headers: { Authorization, "Content-Type": "application/json" },
    method: "PUT",
  });
  if (!response.ok) throw Error(String(response.status));
};
