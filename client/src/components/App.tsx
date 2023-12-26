import {
  Routes as ReactRouterRoutes,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import About from "./pages/About";
import AddMood from "./pages/Mood/AddMood";
import AddSleep from "./pages/Sleep/AddSleep";
import AddWeight from "./pages/Weight/AddWeight";
import Blog from "./pages/Blog";
import ChangeEmail from "./pages/Settings/ChangeEmail";
import ChangePassword from "./pages/Settings/ChangePassword";
import Day from "./pages/Stats/Day";
import EditMood from "./pages/Mood/EditMood";
import EditSleep from "./pages/Sleep/EditSleep";
import EditWeight from "./pages/Weight/EditWeight";
import Explore from "./pages/Stats/Explore";
import Export from "./pages/Settings/Export";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Layout from "./Layout";
import LocationSettings from "./pages/Settings/LocationSettings";
import Meditate from "./pages/Meditation/Meditate";
import MeditationLog from "./pages/Meditation/MeditationLog";
import MeditationTimer from "./pages/Meditation/Meditate/MeditationTimer";
import Month from "./pages/Stats/Month";
import MoodLog from "./pages/Mood/MoodLog";
import Notifications from "./pages/Settings/Notifications";
import OpenEndedMeditation from "./pages/Meditation/Meditate/OpenEndedMeditation";
import Overview from "./pages/Stats/Overview";
import Page from "./shared/Page";
import PrivacyPolicy from "./pages/About/PrivacyPolicy";
import RedirectHome from "./shared/RedirectHome";
import ResendVerification from "./pages/ResendVerification";
import ResetPassword from "./pages/ResetPassword";
import SeeAlso from "./pages/SeeAlso";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SleepLog from "./pages/Sleep/SleepLog";
import { Spinner } from "eri";
import Usage from "./pages/About/Usage";
import Verify from "./pages/Verify";
import VerifyNewEmail from "./pages/Settings/VerifyNewEmail";
import Week from "./pages/Stats/Week";
import WeightLog from "./pages/Weight/WeightLog";
import Year from "./pages/Stats/Year";
import appSlice from "../store/appSlice";
import { useSelector } from "react-redux";
import userSlice from "../store/userSlice";

function Root() {
  const userIsSignedIn = useSelector(userSlice.selectors.isSignedIn);
  const isStorageLoading = useSelector(appSlice.selectors.isStorageLoading);

  return (
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
                      <Page Component={MeditationLog} title="Meditation log" />
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
                    element={<Page Component={EditSleep} title="Edit sleep" />}
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
                    element={<Page Component={AddWeight} title="Add weight" />}
                    path="add"
                  />
                  <Route
                    element={
                      <Page Component={EditWeight} title="Edit weight" />
                    }
                    path="edit/:id"
                  />
                  <Route
                    element={<Page Component={WeightLog} title="Weight log" />}
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
                    element={<Page Component={Explore} title="Explore stats" />}
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
                    <Page Component={ForgotPassword} title="Forgot password" />
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
            element={<Page Component={PrivacyPolicy} title="Privacy policy" />}
            path="privacy-policy"
          />
          <Route
            element={<Page Component={Usage} title="Usage" />}
            path="usage"
          />
        </Route>

        <Route element={<Page Component={Blog} title="Blog" />} path="/blog" />
        <Route
          element={<Page Component={SeeAlso} title="See also" />}
          path="/see-also"
        />
      </Route>
    </ReactRouterRoutes>
  );
}

const router = createBrowserRouter([{ path: "*", Component: Root }]);

export default function App() {
  return <RouterProvider router={router} />;
}
