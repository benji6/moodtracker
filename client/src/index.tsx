import "eri/dist/index.css";
import { EriProvider } from "eri";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import Router from "./components/Router";

ReactDOM.render(
  <EriProvider>
    <Provider store={store}>
      <Router />
    </Provider>
  </EriProvider>,
  document.getElementById("root")
);

if (process.env.NODE_ENV === "production" && navigator.serviceWorker)
  navigator.serviceWorker.register("service-worker.ts");
