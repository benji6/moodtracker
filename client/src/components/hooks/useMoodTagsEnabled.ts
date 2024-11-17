import { useSelector } from "react-redux";
import userSlice from "../../store/userSlice";

// User ids of users who have logged a mood that includes a description
// between 2023-11-18 and 2024-11-19 and within the last 90 days
const ENABLED_USER_IDS = new Set([
  "1f9d98af-7735-4d27-8eea-fc49a5a85554",
  "33fbdb2a-ef69-420f-a59b-811532090690",
  "461425f3-7f85-48e3-94e6-37b276e408fc",
  "6cc24638-9266-44a8-ae4d-f40e92ba631a",
  "7be9f496-cb47-4719-94cc-e6bf2637a556",
  "842e238e-dac4-455f-b724-df4f912b4b4a",
  "9c00f5c0-16fb-43ee-894b-56564cb17657",
  "9d243188-3a40-4d3d-8004-c77168394925",
  "9d3a4f25-06c8-4bb7-a088-a514a7865ec4",
  "9f56dd29-ca7f-4167-a698-35d01a6c90d9",
  "b1e6254c-9569-4600-b9f9-9ca085624e40",
  "cb4f6e4d-53b6-441b-ba73-876db28e743f",
  "cfc0d3ca-346c-4582-b99b-23497f217c32",
  "e5635efd-9a99-41a2-a576-b6f5f69ccfbe",
  "f36b9e7d-4d76-4e82-9108-99b17becf37d",
]);

export function useMoodTagsEnabled(): boolean {
  const userId = useSelector(userSlice.selectors.id);
  return Boolean(userId && ENABLED_USER_IDS.has(userId));
}
