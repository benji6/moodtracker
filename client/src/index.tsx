import "./sentry";
import "eri/dist/index.css";
import "./firebase";
import * as ReactDOM from "react-dom/client";
import {
  PersistQueryClientProvider,
  PersistedClient,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";
import { Provider } from "react-redux";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { captureException } from "./sentry";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { percentFormatter } from "./formatters/numberFormatters";
import router from "./router";
import store from "./store";

export const queryClient = new QueryClient();

if ("serviceWorker" in navigator)
  navigator.serviceWorker.register(
    new URL("service-worker.ts", import.meta.url),
    { type: "module" },
  );

// Added to Safari 17 released 2023-09-18 https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate#browser_compatibility
// TODO: remove when this query returns nothing https://browserslist.dev/?q=aW9zIDwxNyBhbmQgPjAuMSU%3D
if ("estimate" in navigator.storage)
  navigator.storage.estimate().then((estimate) => {
    if (
      estimate.usage === undefined ||
      estimate.quota === undefined ||
      estimate.usage < estimate.quota / 2
    )
      return;
    captureException(
      Error(
        `Storage ${percentFormatter.format(estimate.usage / estimate.quota)} full: ${estimate.usage}`,
      ),
    );
  });

const rootEl = document.getElementById("root");
if (!rootEl) throw Error("no root element");
ReactDOM.createRoot(rootEl).render(
  <StrictMode>
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
        <RouterProvider router={router} />
      </PersistQueryClientProvider>
    </Provider>
  </StrictMode>,
);
