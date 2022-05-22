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
import Location from "./pages/Settings/Location";
import Notifications from "./pages/Settings/Notifications";
import AuthedOnlyPage from "./shared/AuthedOnlyPage";
import UnauthedOnlyPage from "./shared/UnauthedOnlyPage";
import StorageLoadedPage from "./shared/StorageLoadedPage";
import Meditate from "./pages/Meditate";
import MeditationTimer from "./pages/Meditate/MeditationTimer";
import Day from "./pages/Stats/Day";
import { Page } from "./shared/Page";
import RedirectHome from "./RedirectHome";
import Meditation from "./pages/Stats/Meditation";
import FreeMeditation from "./pages/Meditate/FreeMeditation";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";

export default function Routes() {
  return (
    <App>
      <ReactRouterRoutes>
        <Route
          element={<AuthedOnlyPage Component={AddMood} title="Add mood" />}
          path="/add"
        />
        <Route
          element={<AuthedOnlyPage Component={EditMood} title="Edit mood" />}
          path="/edit/:id"
        />

        <Route path="/meditate">
          <Route
            element={<AuthedOnlyPage Component={Meditate} title="Meditate" />}
            path=""
          />
          <Route
            element={
              <AuthedOnlyPage
                Component={FreeMeditation}
                title="Free meditation"
              />
            }
            path="free"
          />
          <Route
            element={
              <AuthedOnlyPage
                Component={MeditationTimer}
                title="Meditation timer"
              />
            }
            path="timer"
          />
        </Route>

        <Route path="settings">
          <Route
            element={
              <AuthedOnlyPage
                Component={ChangePassword}
                title="Change password"
              />
            }
            path="change-password"
          />
          <Route
            element={<AuthedOnlyPage Component={Export} title="Export data" />}
            path="export"
          />
          <Route
            element={<AuthedOnlyPage Component={Location} title="Location" />}
            path="location"
          />
          <Route
            element={
              <AuthedOnlyPage Component={Notifications} title="Notifications" />
            }
            path="notifications"
          />
        </Route>

        <Route path="/stats">
          <Route
            element={
              <AuthedOnlyPage Component={Overview} title="Stats overview" />
            }
            path=""
          />

          <Route
            element={
              <AuthedOnlyPage Component={Explore} title="Explore stats" />
            }
            path="explore"
          />
          <Route
            element={
              <AuthedOnlyPage Component={Meditation} title="Meditation stats" />
            }
            path="meditation"
          />

          <Route path="days">
            <Route
              element={<AuthedOnlyPage Component={Day} title="Day stats" />}
              path=":day"
            />
          </Route>
          <Route path="weeks">
            <Route
              element={<AuthedOnlyPage Component={Week} title="Week stats" />}
              path=":week"
            />
          </Route>
          <Route path="months">
            <Route
              element={<AuthedOnlyPage Component={Month} title="Month stats" />}
              path=":month"
            />
          </Route>
          <Route path="years">
            <Route
              element={<AuthedOnlyPage Component={Year} title="Year stats" />}
              path=":year"
            />
          </Route>
        </Route>

        <Route
          element={<Page Component={About} title="About" />}
          path="/about"
        />
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
          element={
            <UnauthedOnlyPage
              Component={ForgotPassword}
              title="Forgot password"
            />
          }
          path="/forgot-password"
        />
        <Route
          element={
            <UnauthedOnlyPage
              Component={ResendVerification}
              title="Resend verification"
            />
          }
          path="/resend-verification"
        />
        <Route
          element={
            <UnauthedOnlyPage
              Component={ResetPassword}
              title="Reset password"
            />
          }
          path="/reset-password"
        />
        <Route
          element={<UnauthedOnlyPage Component={SignIn} title="Sign in" />}
          path="/sign-in"
        />
        <Route
          element={<UnauthedOnlyPage Component={SignUp} title="Sign up" />}
          path="/sign-up"
        />
        <Route
          element={<UnauthedOnlyPage Component={Verify} title="Verify" />}
          path="/verify"
        />

        <Route element={<RedirectHome />} path="*" />
      </ReactRouterRoutes>
    </App>
  );
}
