/* eslint-disable import/no-unresolved */
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./components/App/index";

import "./styles/global.sass";
import "./favicon.ico";

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("app")
);
