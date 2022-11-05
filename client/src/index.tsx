import "eri/dist/index.css";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import Routes from "./components/Routes";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
  navigator.serviceWorker.register(
    new URL("service-worker.ts", import.meta.url),
    { type: "module" }
  );

// TODO delete this around 2023-01-01
window.requestIdleCallback(async () => {
  const registration = await navigator.serviceWorker.ready;
  if ("periodicSync" in registration) {
    (registration as any).periodicSync.unregister("daily-notification");
  }
});
