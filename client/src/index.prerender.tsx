import { EriProvider } from "eri";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import Router from "./components/Router";
import store from "./store";
import appSlice from "./store/appSlice";

store.dispatch(appSlice.actions.storageLoaded());

const html = ReactDOMServer.renderToString(
  <EriProvider renderingToString>
    <Provider store={store}>
      <Router />
    </Provider>
  </EriProvider>
);

ReactDOM.render(<pre id="output">{html}</pre>, document.getElementById("root"));
