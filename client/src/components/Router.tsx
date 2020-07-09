import { Router as ReachRouter } from "@reach/router";
import * as React from "react";
import _404 from "./pages/_404";
import About from "./pages/About";
import AddMood from "./pages/AddMood";
import EditMood from "./pages/EditMood";
import Home from "./pages/Home";
import ResendVerification from "./pages/ResendVerification";
import SeeAlso from "./pages/SeeAlso";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Verify from "./pages/Verify";
import Stats from "./pages/Stats";

export default function Router() {
  return (
    <ReachRouter>
      <_404 default />
      <Home path="/" />
      <About path="about" />
      <AddMood path="add" />
      <EditMood path="edit/:id" />
      <ResendVerification path="resend-verification" />
      <SeeAlso path="see-also" />
      <SignIn path="sign-in" />
      <SignUp path="sign-up" />
      <Stats path="stats" />
      <Verify path="verify" />
    </ReachRouter>
  );
}
