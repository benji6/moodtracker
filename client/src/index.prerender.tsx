import { EriProvider } from "eri";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./store";
import appSlice from "./store/appSlice";

store.dispatch(appSlice.actions.storageLoaded());

const html = ReactDOMServer.renderToString(
  <EriProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </EriProvider>
);

console.log(html);
