import React from "react";
import Landingpage from "./components/Landingpage.jsx";
import LoginError from "./components/LoginError";
import Homepage from "./components/Homepage";
import Timeline from "./components/Timeline.jsx"
import Database from "./components/Admin/Database"
import IncoherenceReporting from "./components/IncoherenceReporting";
import Reporting from "./components/Reporting/Reporting";

import { Header } from "./components/Header";
import { HashRouter, Route } from "react-router-dom";
import { config } from "./config"
import authGuard from "./HOCs/authGuard.js";

export const AppRouter = (props) => {
  return (
    <HashRouter  {...props} >
      <Header />
      <Route exact path={"/"} component={Homepage} />
      <Route exact path={"/error"} component={LoginError} />
      <Route exact path={"/incoherence_reporting"} component={authGuard(IncoherenceReporting)} />
      <Route exact path={"/reporting"} component={authGuard(Reporting)} />
      <Route exact path={"/devtimeline"} component={Timeline} />
    </HashRouter>
  );
};
