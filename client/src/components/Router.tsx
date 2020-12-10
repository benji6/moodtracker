import { Router as ReachRouter } from "@reach/router";
import * as React from "react";
import _404 from "./pages/_404";
import About from "./pages/About";
import AddMood from "./pages/AddMood";
import EditMood from "./pages/EditMood";
import Home from "./pages/Home";
import Month from "./pages/Stats/Month";
import ResendVerification from "./pages/ResendVerification";
import SeeAlso from "./pages/SeeAlso";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Stats from "./pages/Stats";
import Verify from "./pages/Verify";
import Week from "./pages/Stats/Week";
import ExploreStats from "./pages/Stats/ExploreStats";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function Router() {
  return (
    <ReachRouter>
      <_404 default />
      <Home path="/" />
      <About path="about" />
      <AddMood path="add" />
      <EditMood path="edit/:id" />
      <ForgotPassword path="forgot-password" />
      <ExploreStats path="stats/explore" />
      <Month path="stats/months/:month" />
      <ResendVerification path="resend-verification" />
      <ResetPassword path="reset-password" />
      <SeeAlso path="see-also" />
      <SignIn path="sign-in" />
      <SignUp path="sign-up" />
      <Stats path="stats" />
      <Verify path="verify" />
      <Week path="stats/weeks/:week" />
    </ReachRouter>
  );
}
