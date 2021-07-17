import { Router as ReachRouter } from "@reach/router";
import * as React from "react";
import About from "./pages/About";
import AddMood from "./pages/AddMood";
import EditMood from "./pages/EditMood";
import Home from "./pages/Home";
import Month from "./pages/Stats/Month";
import ResendVerification from "./pages/ResendVerification";
import SeeAlso from "./pages/SeeAlso";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Overview from "./pages/Stats/Overview";
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
import Notifications from "./pages/Settings/Notifications";
import AuthedOnlyPage from "./shared/AuthedOnlyPage";
import UnauthedOnlyPage from "./shared/UnauthedOnlyPage";
import StorageLoadedPage from "./shared/StorageLoadedPage";
import Meditate from "./pages/Meditate";
import MeditationTimer from "./pages/Meditate/MeditationTimer";
import Day from "./pages/Stats/Day";
import { Page } from "./shared/Page";
import RedirectHome from "./pages/RedirectHome";
import Meditation from "./pages/Stats/Meditation";

export default function Router() {
  return (
    <ReachRouter>
      <App path="/">
        <RedirectHome path="/401" />
        <RedirectHome default />

        <AuthedOnlyPage Component={AddMood} path="/add" title="Add mood" />
        <AuthedOnlyPage
          Component={EditMood}
          path="/edit/:id"
          title="Edit mood"
        />
        <AuthedOnlyPage
          Component={Meditate}
          path="/meditate"
          title="Meditate"
        />
        <AuthedOnlyPage
          Component={MeditationTimer}
          path="/meditate/timer"
          title="Meditation timer"
        />
        <AuthedOnlyPage
          Component={ChangePassword}
          path="/settings/change-password"
          title="Change password"
        />
        <AuthedOnlyPage
          Component={Export}
          path="/settings/export"
          title="Export data"
        />
        <AuthedOnlyPage
          Component={Notifications}
          path="/settings/notifications"
          title="Notifications"
        />
        <AuthedOnlyPage
          Component={Overview}
          path="/stats"
          title="Stats overview"
        />
        <AuthedOnlyPage
          Component={Explore}
          path="/stats/explore"
          title="Explore stats"
        />
        <AuthedOnlyPage
          Component={Day}
          path="/stats/days/:day"
          title="Day stats"
        />
        <AuthedOnlyPage
          Component={Month}
          path="/stats/months/:month"
          title="Month stats"
        />
        <AuthedOnlyPage
          Component={Meditation}
          path="/stats/meditation"
          title="Meditation stats"
        />
        <AuthedOnlyPage
          Component={Week}
          path="/stats/weeks/:week"
          title="Week stats"
        />
        <AuthedOnlyPage
          Component={Year}
          path="/stats/years/:year"
          title="Year stats"
        />

        <Page Component={About} path="/about" title="About" />
        <Page Component={Blog} path="/blog" title="Blog" />
        <Page Component={SeeAlso} path="/see-also" title="See also" />

        <StorageLoadedPage
          Component={Home}
          path="/"
          title="A mood tracker & meditation timer that helps you understand yourself"
        />

        <UnauthedOnlyPage
          Component={ForgotPassword}
          path="/forgot-password"
          title="Forgot password"
        />
        <UnauthedOnlyPage
          Component={ResendVerification}
          path="/resend-verification"
          title="Resend verification"
        />
        <UnauthedOnlyPage
          Component={ResetPassword}
          path="/reset-password"
          title="Reset password"
        />
        <UnauthedOnlyPage Component={SignIn} path="/sign-in" title="Sign in" />
        <UnauthedOnlyPage Component={SignUp} path="/sign-up" title="Sign up" />
        <UnauthedOnlyPage Component={Verify} path="/verify" title="Verify" />
      </App>
    </ReachRouter>
  );
}
