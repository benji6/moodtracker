import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectHome() {
  const navigate = useNavigate();
  useEffect(() => navigate("/"));
  return null;
}
