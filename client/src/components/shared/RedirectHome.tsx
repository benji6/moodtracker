import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function RedirectHome() {
  const navigate = useNavigate();
  useEffect(() => void navigate("/"));
  return null;
}
