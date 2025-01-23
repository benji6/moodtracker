import { useSelector } from "react-redux";
import userSlice from "../../store/userSlice";

// User ids of users who have logged a mood that includes a description
// between 2023-11-18 and 2024-11-19 and within the last 90 days
const ENABLED_USER_IDS = new Set([
  "6cc24638-9266-44a8-ae4d-f40e92ba631a",
  "7be9f496-cb47-4719-94cc-e6bf2637a556",
  "b1e6254c-9569-4600-b9f9-9ca085624e40",
  "cb4f6e4d-53b6-441b-ba73-876db28e743f",
  "e5635efd-9a99-41a2-a576-b6f5f69ccfbe",
]);

export function useMoodTagsEnabled(): boolean {
  const userId = useSelector(userSlice.selectors.id);
  return Boolean(userId && ENABLED_USER_IDS.has(userId));
}
