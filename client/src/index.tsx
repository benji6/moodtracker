import "eri/dist/index.css";
import { EriProvider } from "eri";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./store";

(process.env.NODE_ENV === "production" ? ReactDOM.hydrate : ReactDOM.render)(
  <EriProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </EriProvider>,
  document.getElementById("root")
);

if (process.env.NODE_ENV === "production" && navigator.serviceWorker)
  navigator.serviceWorker.register("service-worker.ts");
