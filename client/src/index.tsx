import "./sentry";
import "eri/dist/index.css";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import Routes from "./components/Routes";
import { QueryClient } from "@tanstack/react-query";
import {
  PersistedClient,
  PersistQueryClientProvider,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client";
import { captureException } from "./sentry";
import { del, get, set } from "idb-keyval";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            maxAge: Infinity,
            persister: createAsyncStoragePersister({
              // The type signatures do not match how I chose to use the API
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              deserialize: (x) => x as any,
              key: "moodtracker:react-query-cache",
              retry(props) {
                captureException(props.error);
                return removeOldestQuery(props);
              },
              // The type signatures do not match how I chose to use the API
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              serialize: (x) => x as any,
              storage: {
                getItem: async (key: string) =>
                  // The type signatures do not match how I chose to use the API
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  get<PersistedClient>(key) as any,
                removeItem: (key: string) => del(key),
                setItem: (key: string, value: string) => set(key, value),
              },
            }),
          }}
        >
          <Routes />
        </PersistQueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
  navigator.serviceWorker.register(
    new URL("service-worker.ts", import.meta.url),
    { type: "module" }
  );
