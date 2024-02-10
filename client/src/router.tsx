import {
  Routes as ReactRouterRoutes,
  Route,
  createBrowserRouter,
} from "react-router-dom";
import About from "./components/pages/About";
import AddMood from "./components/pages/Mood/AddMood";
import AddSleep from "./components/pages/Sleep/AddSleep";
import AddWeight from "./components/pages/Weight/AddWeight";
import Blog from "./components/pages/Blog";
import ChangeEmail from "./components/pages/Settings/ChangeEmail";
import ChangePassword from "./components/pages/Settings/ChangePassword";
import Day from "./components/pages/Stats/Day";
import EditMood from "./components/pages/Mood/EditMood";
import EditSleep from "./components/pages/Sleep/EditSleep";
import EditWeight from "./components/pages/Weight/EditWeight";
import { ErrorBoundary } from "@sentry/react";
import Explore from "./components/pages/Stats/Explore";
import Export from "./components/pages/Settings/Export";
import ForgotPassword from "./components/pages/ForgotPassword";
import Home from "./components/pages/Home";
import Layout from "./components/Layout";
import LocationSettings from "./components/pages/Settings/LocationSettings";
import Meditate from "./components/pages/Meditation/Meditate";
import MeditationLog from "./components/pages/Meditation/MeditationLog";
import MeditationTimer from "./components/pages/Meditation/Meditate/MeditationTimer";
import Month from "./components/pages/Stats/Month";
import MoodLog from "./components/pages/Mood/MoodLog";
import Notifications from "./components/pages/Settings/Notifications";
import OpenEndedMeditation from "./components/pages/Meditation/Meditate/OpenEndedMeditation";
import Overview from "./components/pages/Stats/Overview";
import Page from "./components/shared/Page";
import PrivacyPolicy from "./components/pages/About/PrivacyPolicy";
import { REPO_ISSUES_URL } from "./constants";
import RedirectHome from "./components/shared/RedirectHome";
import ResendVerification from "./components/pages/ResendVerification";
import ResetPassword from "./components/pages/ResetPassword";
import SeeAlso from "./components/pages/SeeAlso";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import SleepLog from "./components/pages/Sleep/SleepLog";
import { Spinner } from "eri";
import Usage from "./components/pages/About/Usage";
import Verify from "./components/pages/Verify";
import VerifyNewEmail from "./components/pages/Settings/VerifyNewEmail";
import Week from "./components/pages/Stats/Week";
import WeightLog from "./components/pages/Weight/WeightLog";
import Year from "./components/pages/Stats/Year";
import appSlice from "./store/appSlice";
import { useSelector } from "react-redux";
import userSlice from "./store/userSlice";

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
            <Route
              element={
                <div className="center">
                  <Spinner />
                  Storage loading...
                </div>
              }
              path="*"
            />
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
                  <Route
                    element={<Page Component={AddMood} title="Add mood" />}
                    path="/add"
                  />
                  <Route
                    element={<Page Component={EditMood} title="Edit mood" />}
                    path="/edit/:id"
                  />
                  <Route path="/mood">
                    <Route
                      element={<Page Component={MoodLog} title="Mood log" />}
                      path="log"
                    />
                  </Route>
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
                  <Route path="/sleep">
                    <Route element={<RedirectHome />} path="" />
                    <Route
                      element={<Page Component={AddSleep} title="Add sleep" />}
                      path="add"
                    />
                    <Route
                      element={
                        <Page Component={EditSleep} title="Edit sleep" />
                      }
                      path="edit/:id"
                    />
                    <Route
                      element={<Page Component={SleepLog} title="Sleep log" />}
                      path="log"
                    />
                  </Route>
                  <Route path="/weight">
                    <Route element={<RedirectHome />} path="" />
                    <Route
                      element={
                        <Page Component={AddWeight} title="Add weight" />
                      }
                      path="add"
                    />
                    <Route
                      element={
                        <Page Component={EditWeight} title="Edit weight" />
                      }
                      path="edit/:id"
                    />
                    <Route
                      element={
                        <Page Component={WeightLog} title="Weight log" />
                      }
                      path="log"
                    />
                  </Route>
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
                      element={<Page Component={Export} title="Export data" />}
                      path="export"
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
