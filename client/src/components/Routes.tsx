import About from "./pages/About";
import AddMood from "./pages/Mood/AddMood";
import EditMood from "./pages/Mood/EditMood";
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
import LocationSettings from "./pages/Settings/LocationSettings";
import Notifications from "./pages/Settings/Notifications";
import StorageLoadedPage from "./shared/StorageLoadedPage";
import Meditate from "./pages/Meditation/Meditate";
import MeditationTimer from "./pages/Meditation/Meditate/MeditationTimer";
import Day from "./pages/Stats/Day";
import { Page } from "./shared/Page";
import RedirectHome from "./shared/RedirectHome";
import OpenEndedMeditation from "./pages/Meditation/Meditate/OpenEndedMeditation";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import AddWeight from "./pages/Weight/AddWeight";
import EditWeight from "./pages/Weight/EditWeight";
import ChangeEmail from "./pages/Settings/ChangeEmail";
import VerifyNewEmail from "./pages/Settings/VerifyNewEmail";
import MeditationLog from "./pages/Meditation/MeditationLog";
import WeightLog from "./pages/Weight/WeightLog";
import MoodLog from "./pages/Mood/MoodLog";
import PrivacyPolicy from "./pages/About/PrivacyPolicy";
import Usage from "./pages/About/Usage";
import { useSelector } from "react-redux";
import { userIsSignedInSelector, userLoadingSelector } from "../selectors";
import { Spinner } from "eri";

export default function Routes() {
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const userLoading = useSelector(userLoadingSelector);

  return (
    <App>
      <ReactRouterRoutes>
        {userIsSignedIn ? (
          <>
            <Route
              element={
                <StorageLoadedPage Component={AddMood} title="Add mood" />
              }
              path="/add"
            />
            <Route
              element={
                <StorageLoadedPage Component={EditMood} title="Edit mood" />
              }
              path="/edit/:id"
            />
            <Route path="/mood">
              <Route
                element={
                  <StorageLoadedPage Component={MoodLog} title="Mood log" />
                }
                path="log"
              />
            </Route>
            <Route path="/meditation">
              <Route
                element={
                  <StorageLoadedPage Component={Meditate} title="Meditate" />
                }
                path=""
              />
              <Route
                element={
                  <StorageLoadedPage
                    Component={MeditationLog}
                    title="Meditation log"
                  />
                }
                path="log"
              />
              <Route
                element={
                  <StorageLoadedPage
                    Component={OpenEndedMeditation}
                    title="Open-ended meditation"
                  />
                }
                path="open-ended"
              />
              <Route
                element={
                  <StorageLoadedPage
                    Component={MeditationTimer}
                    title="Meditation timer"
                  />
                }
                path="timer"
              />
            </Route>
            <Route path="/weight">
              <Route element={<RedirectHome />} path="" />
              <Route
                element={
                  <StorageLoadedPage Component={AddWeight} title="Add weight" />
                }
                path="add"
              />
              <Route
                element={
                  <StorageLoadedPage
                    Component={EditWeight}
                    title="Edit weight"
                  />
                }
                path="edit/:id"
              />
              <Route
                element={
                  <StorageLoadedPage Component={WeightLog} title="Weight log" />
                }
                path="log"
              />
            </Route>
            <Route path="settings">
              <Route
                element={
                  <StorageLoadedPage
                    Component={ChangeEmail}
                    title="Change email"
                  />
                }
                path="change-email"
              />
              <Route
                element={
                  <StorageLoadedPage
                    Component={VerifyNewEmail}
                    title="Verify new email address"
                  />
                }
                path="verify-new-email"
              />
              <Route
                element={
                  <StorageLoadedPage
                    Component={ChangePassword}
                    title="Change password"
                  />
                }
                path="change-password"
              />
              <Route
                element={
                  <StorageLoadedPage Component={Export} title="Export data" />
                }
                path="export"
              />
              <Route
                element={
                  <StorageLoadedPage
                    Component={LocationSettings}
                    title="Location"
                  />
                }
                path="location"
              />
              <Route
                element={
                  <StorageLoadedPage
                    Component={Notifications}
                    title="Notifications"
                  />
                }
                path="notifications"
              />
            </Route>
            <Route path="/stats">
              <Route
                element={
                  <StorageLoadedPage
                    Component={Overview}
                    title="Stats overview"
                  />
                }
                path=""
              />

              <Route
                element={
                  <StorageLoadedPage
                    Component={Explore}
                    title="Explore stats"
                  />
                }
                path="explore"
              />

              <Route path="days">
                <Route
                  element={
                    <StorageLoadedPage Component={Day} title="Day stats" />
                  }
                  path=":date"
                />
              </Route>
              <Route path="weeks">
                <Route
                  element={
                    <StorageLoadedPage Component={Week} title="Week stats" />
                  }
                  path=":date"
                />
              </Route>
              <Route path="months">
                <Route
                  element={
                    <StorageLoadedPage Component={Month} title="Month stats" />
                  }
                  path=":date"
                />
              </Route>
              <Route path="years">
                <Route
                  element={
                    <StorageLoadedPage Component={Year} title="Year stats" />
                  }
                  path=":date"
                />
              </Route>
            </Route>
          </>
        ) : (
          <>
            <Route
              element={
                <StorageLoadedPage
                  Component={ForgotPassword}
                  title="Forgot password"
                />
              }
              path="/forgot-password"
            />
            <Route
              element={
                <StorageLoadedPage
                  Component={ResendVerification}
                  title="Resend verification"
                />
              }
              path="/resend-verification"
            />
            <Route
              element={
                <StorageLoadedPage
                  Component={ResetPassword}
                  title="Reset password"
                />
              }
              path="/reset-password"
            />
            <Route
              element={<StorageLoadedPage Component={SignIn} title="Sign in" />}
              path="/sign-in"
            />
            <Route
              element={<StorageLoadedPage Component={SignUp} title="Sign up" />}
              path="/sign-up"
            />
            <Route
              element={<StorageLoadedPage Component={Verify} title="Verify" />}
              path="/verify"
            />
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

        <Route
          element={
            <StorageLoadedPage
              Component={Home}
              title="A mood tracker & meditation timer that helps you understand yourself"
            />
          }
          path="/"
        />

        <Route
          element={userLoading ? <Spinner /> : <RedirectHome />}
          path="*"
        />
      </ReactRouterRoutes>
    </App>
  );
}
