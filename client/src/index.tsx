import "eri/dist/index.css";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import Routes from "./components/Routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

if (process.env.NODE_ENV === "production" && navigator.serviceWorker)
  navigator.serviceWorker.register(
    new URL("service-worker.ts", import.meta.url),
    { type: "module" }
  );
