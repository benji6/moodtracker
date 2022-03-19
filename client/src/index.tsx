import "eri/dist/index.css";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import Routes from "./components/Routes";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

if (process.env.NODE_ENV === "production" && navigator.serviceWorker)
  navigator.serviceWorker.register(
    new URL("service-worker.ts", import.meta.url),
    { type: "module" }
  );
