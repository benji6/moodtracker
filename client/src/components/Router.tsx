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
import AuthedOnlyPage from "./shared/AuthedOnlyPage";
import _401 from "./pages/_401";

export default function Router() {
  return (
    <ReachRouter>
      <App path="/">
        <_401 path="/401" />
        <_404 default />
        <About path="/about" />
        <AuthedOnlyPage Component={AddMood} path="/add" />
        <AuthedOnlyPage
          Component={ChangePassword}
          path="/settings/change-password"
        />
        <AuthedOnlyPage Component={EditMood} path="/edit/:id" />
        <AuthedOnlyPage Component={Explore} path="/stats/explore" />
        <AuthedOnlyPage Component={Export} path="/settings/export" />
        <AuthedOnlyPage Component={Month} path="/stats/months/:month" />
        <AuthedOnlyPage
          Component={Notifications}
          path="/settings/notifications"
        />
        <AuthedOnlyPage Component={Settings} path="/settings" />
        <AuthedOnlyPage Component={Stats} path="/stats" />
        <AuthedOnlyPage Component={Week} path="/stats/weeks/:week" />
        <AuthedOnlyPage Component={Year} path="/stats/years/:year" />
        <Blog path="/blog" />
        <ForgotPassword path="/forgot-password" />
        <Home path="/" />
        <ResendVerification path="/resend-verification" />
        <ResetPassword path="/reset-password" />
        <SeeAlso path="/see-also" />
        <SignIn path="/sign-in" />
        <SignUp path="/sign-up" />
        <Verify path="/verify" />
      </App>
    </ReachRouter>
  );
}
