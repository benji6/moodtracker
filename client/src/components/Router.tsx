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
import Explore from "./pages/Stats/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/Settings/ChangePassword";
import App from "./App";
import Blog from "./pages/Blog";
import Year from "./pages/Stats/Year";
import Export from "./pages/Settings/Export";
import Settings from "./pages/Settings";
import Notifications from "./pages/Settings/Notifications";

export default function Router() {
  return (
    <ReachRouter>
      <App path="/">
        <_404 default />
        <Home path="/" />
        <About path="/about" />
        <About path="/about" />
        <AddMood path="/add" />
        <Blog path="/blog" />
        <ChangePassword path="/settings/change-password" />
        <EditMood path="/edit/:id" />
        <ForgotPassword path="/forgot-password" />
        <Explore path="/stats/explore" />
        <Export path="/settings/export" />
        <Month path="/stats/months/:month" />
        <Notifications path="/settings/notifications" />
        <ResendVerification path="/resend-verification" />
        <ResetPassword path="/reset-password" />
        <SeeAlso path="/see-also" />
        <Settings path="/settings" />
        <SignIn path="/sign-in" />
        <SignUp path="/sign-up" />
        <Stats path="/stats" />
        <Verify path="/verify" />
        <Week path="/stats/weeks/:week" />
        <Year path="/stats/years/:year" />
      </App>
    </ReachRouter>
  );
}
