import { Router as ReachRouter } from "@reach/router";
import * as React from "react";
import _404 from "./pages/_404";
import About from "./pages/About";
import AddMood from "./pages/AddMood";
import Home from "./pages/Home";
import ResendVerification from "./pages/ResendVerification";
import SeeAlso from "./pages/SeeAlso";
import SignUp from "./pages/SignUp";
import Verify from "./pages/Verify";

export default function Router() {
  return (
    <ReachRouter>
      <_404 default />
      <Home path="/" />
      <About path="about" />
      <AddMood path="add" />
      <ResendVerification path="resend-verification" />
      <SeeAlso path="see-also" />
      <SignUp path="sign-up" />
      <Verify path="verify" />
    </ReachRouter>
  );
}
