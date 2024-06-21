import {
  Routes as ReactRouterRoutes,
  Route,
  createBrowserRouter,
} from "react-router-dom";
import About from "../components/pages/About";
import AddLegRaises from "../components/pages/LegRaises/AddLegRaises";
import AddMood from "../components/pages/Mood/AddMood";
import AddPushUps from "../components/pages/PushUps/AddPushUps";
import AddRun from "../components/pages/Run/AddRun";
import AddSitUps from "../components/pages/SitUps/AddSitUps";
import AddSleep from "../components/pages/Sleep/AddSleep";
import AddWeight from "../components/pages/Weight/AddWeight";
import Blog from "../components/pages/Blog";
import ChangeEmail from "../components/pages/Settings/ChangeEmail";
import ChangePassword from "../components/pages/Settings/ChangePassword";
import Day from "../components/pages/Stats/Day";
import EditLegRaises from "../components/pages/LegRaises/EditLegRaises";
import EditMood from "../components/pages/Mood/EditMood";
import EditPushUps from "../components/pages/PushUps/EditPushUps";
import EditRun from "../components/pages/Run/EditRun";
import EditSitUps from "../components/pages/SitUps/EditSitUps";
import EditSleep from "../components/pages/Sleep/EditSleep";
import EditWeight from "../components/pages/Weight/EditWeight";
import { ErrorBoundary } from "@sentry/react";
import EventSettings from "../components/pages/Settings/EventSettings";
import Explore from "../components/pages/Stats/Explore";
import ForgotPassword from "../components/pages/ForgotPassword";
import Home from "../components/pages/Home";
import Layout from "../components/Layout";
import LegRaisesLog from "../components/pages/LegRaises/LegRaisesLog";
import LocationSettings from "../components/pages/Settings/LocationSettings";
import Meditate from "../components/pages/Meditation/Meditate";
import MeditationLog from "../components/pages/Meditation/MeditationLog";
import MeditationTimer from "../components/pages/Meditation/Meditate/MeditationTimer";
import Month from "../components/pages/Stats/Month";
import MoodLog from "../components/pages/Mood/MoodLog";
import Notifications from "../components/pages/Settings/Notifications";
import OpenEndedMeditation from "../components/pages/Meditation/Meditate/OpenEndedMeditation";
import Overview from "../components/pages/Stats/Overview";
import Page from "../components/shared/Page";
import PrivacyPolicy from "../components/pages/About/PrivacyPolicy";
import PushUpsLog from "../components/pages/PushUps/PushUpsLog";
import { REPO_ISSUES_URL } from "../constants";
import RedirectHome from "../components/shared/RedirectHome";
import ResendVerification from "../components/pages/ResendVerification";
import ResetPassword from "../components/pages/ResetPassword";
import RunLog from "../components/pages/Run/RunLog";
import SeeAlso from "../components/pages/SeeAlso";
import SignIn from "../components/pages/SignIn";
import SignUp from "../components/pages/SignUp";
import SitUpsLog from "../components/pages/SitUps/SitUpsLog";
import SleepLog from "../components/pages/Sleep/SleepLog";
import { Spinner } from "eri";
import Usage from "../components/pages/About/Usage";
import Verify from "../components/pages/Verify";
import VerifyNewEmail from "../components/pages/Settings/VerifyNewEmail";
import Week from "../components/pages/Stats/Week";
import WeightLog from "../components/pages/Weight/WeightLog";
import Year from "../components/pages/Stats/Year";
import appSlice from "../store/appSlice";
import trackedCategoryRoutes from "./trackedCategoryRoutes";
import { useSelector } from "react-redux";
import userSlice from "../store/userSlice";

function Root() {
  const userIsSignedIn = useSelector(userSlice.selectors.isSignedIn);
  const isStorageLoading = useSelector(appSlice.selectors.isStorageLoading);

  return (
    <ErrorBoundary
      fallback={
        <p className="center">
          Oops something went wrong! The error should be reported automatically,
          but please do{" "}
          <a href={REPO_ISSUES_URL} rel="noopener" target="_blank">
            raise an issue on GitHub
          </a>{" "}
          to ensure it gets looked at.
        </p>
      }
    >
      <ReactRouterRoutes>
        <Route element={<Layout />}>
          {isStorageLoading ? (
            <Route element={<Spinner />} path="*" />
          ) : (
            <>
              <Route element={<RedirectHome />} path="*" />
              <Route
                element={
                  <Page
                    Component={Home}
                    title="A mood tracker & meditation timer that helps you understand yourself"
                  />
                }
                path="/"
              />
              {userIsSignedIn ? (
                <>
                  <Route path="/meditation">
                    <Route
                      element={<Page Component={Meditate} title="Meditate" />}
                      path=""
                    />
                    <Route
                      element={
                        <Page
                          Component={MeditationLog}
                          title="Meditation log"
                        />
                      }
                      path="log"
                    />
                    <Route
                      element={
                        <Page
                          Component={OpenEndedMeditation}
                          title="Open-ended meditation"
                        />
                      }
                      path="open-ended"
                    />
                    <Route
                      element={
                        <Page
                          Component={MeditationTimer}
                          title="Meditation timer"
                        />
                      }
                      path="timer"
                    />
                  </Route>
                  {[
                    trackedCategoryRoutes({
                      AddComponent: AddMood,
                      EditComponent: EditMood,
                      eventType: "moods",
                      LogComponent: MoodLog,
                    }),
                    trackedCategoryRoutes({
                      AddComponent: AddLegRaises,
                      EditComponent: EditLegRaises,
                      eventType: "leg-raises",
                      LogComponent: LegRaisesLog,
                    }),
                    trackedCategoryRoutes({
                      AddComponent: AddPushUps,
                      EditComponent: EditPushUps,
                      eventType: "push-ups",
                      LogComponent: PushUpsLog,
                    }),
                    trackedCategoryRoutes({
                      AddComponent: AddSitUps,
                      EditComponent: EditSitUps,
                      eventType: "sit-ups",
                      LogComponent: SitUpsLog,
                    }),
                    trackedCategoryRoutes({
                      AddComponent: AddRun,
                      EditComponent: EditRun,
                      eventType: "runs",
                      LogComponent: RunLog,
                    }),
                    trackedCategoryRoutes({
                      AddComponent: AddSleep,
                      EditComponent: EditSleep,
                      eventType: "sleeps",
                      LogComponent: SleepLog,
                    }),
                    trackedCategoryRoutes({
                      AddComponent: AddWeight,
                      EditComponent: EditWeight,
                      eventType: "weights",
                      LogComponent: WeightLog,
                    }),
                  ]}
                  <Route path="settings">
                    <Route
                      element={
                        <Page Component={ChangeEmail} title="Change email" />
                      }
                      path="change-email"
                    />
                    <Route
                      element={
                        <Page
                          Component={VerifyNewEmail}
                          title="Verify new email address"
                        />
                      }
                      path="verify-new-email"
                    />
                    <Route
                      element={
                        <Page
                          Component={ChangePassword}
                          title="Change password"
                        />
                      }
                      path="change-password"
                    />
                    <Route
                      element={
                        <Page Component={EventSettings} title="Events" />
                      }
                      path="events"
                    />
                    <Route
                      element={
                        <Page Component={LocationSettings} title="Location" />
                      }
                      path="location"
                    />
                    <Route
                      element={
                        <Page Component={Notifications} title="Notifications" />
                      }
                      path="notifications"
                    />
                  </Route>
                  <Route path="/stats">
                    <Route
                      element={
                        <Page Component={Overview} title="Stats overview" />
                      }
                      path=""
                    />

                    <Route
                      element={
                        <Page Component={Explore} title="Explore stats" />
                      }
                      path="explore"
                    />

                    <Route path="days">
                      <Route
                        element={<Page Component={Day} title="Day stats" />}
                        path=":date"
                      />
                    </Route>
                    <Route path="weeks">
                      <Route
                        element={<Page Component={Week} title="Week stats" />}
                        path=":date"
                      />
                    </Route>
                    <Route path="months">
                      <Route
                        element={<Page Component={Month} title="Month stats" />}
                        path=":date"
                      />
                    </Route>
                    <Route path="years">
                      <Route
                        element={<Page Component={Year} title="Year stats" />}
                        path=":date"
                      />
                    </Route>
                  </Route>
                </>
              ) : (
                <>
                  <Route
                    element={
                      <Page
                        Component={ForgotPassword}
                        title="Forgot password"
                      />
                    }
                    path="/forgot-password"
                  />
                  <Route
                    element={
                      <Page
                        Component={ResendVerification}
                        title="Resend verification"
                      />
                    }
                    path="/resend-verification"
                  />
                  <Route
                    element={
                      <Page Component={ResetPassword} title="Reset password" />
                    }
                    path="/reset-password"
                  />
                  <Route
                    element={<Page Component={SignIn} title="Sign in" />}
                    path="/sign-in"
                  />
                  <Route
                    element={<Page Component={SignUp} title="Sign up" />}
                    path="/sign-up"
                  />
                  <Route
                    element={<Page Component={Verify} title="Verify" />}
                    path="/verify"
                  />
                </>
              )}
            </>
          )}

          <Route path="/about">
            <Route element={<Page Component={About} title="About" />} path="" />
            <Route
              element={
                <Page Component={PrivacyPolicy} title="Privacy policy" />
              }
              path="privacy-policy"
            />
            <Route
              element={<Page Component={Usage} title="Usage" />}
              path="usage"
            />
          </Route>

          <Route
            element={<Page Component={Blog} title="Blog" />}
            path="/blog"
          />
          <Route
            element={<Page Component={SeeAlso} title="See also" />}
            path="/see-also"
          />
        </Route>
      </ReactRouterRoutes>
    </ErrorBoundary>
  );
}

export default createBrowserRouter([{ path: "*", Component: Root }]);
