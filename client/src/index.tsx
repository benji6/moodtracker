import "eri/dist/index.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import AppState from "./components/AppState";

ReactDOM.render(
  <AppState>
    <App />
  </AppState>,
  document.getElementById("root")
);

if (process.env.NODE_ENV === "production" && navigator.serviceWorker)
  navigator.serviceWorker.register("service-worker.ts");
