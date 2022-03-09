import React from "react";
import { useSelector } from "react-redux";


import LoginError from "./components/LoginError";
import Homepage from "./components/Homepage";
import Timeline from "./components/Timeline.jsx"

import IncoherenceReporting from "./components/IncoherenceReporting";
import Reporting from "./components/Reporting/Reporting";

import { Ransharing } from "./components/Ransharing/Ransharing";

import { Header } from "./components/Header/Header";
import { HashRouter, Route, Routes } from "react-router-dom";
import { config } from "./config"
import authGuard from "./HOCs/authGuard.js";
import { Home } from "react-feather";

export const AppRouter = (props) => {
  const user = useSelector((state) => ({ auth: state.auth }));
  const isAuthentificated  = useSelector((state) =>   state.auth.isAuthenticated );

  return (
    <HashRouter  {...props} >
      <Header />
      <Routes>
        {/* TODO: check  authguardcheck */}
        <Route exact path={"/"} element={<Homepage />} />
        <Route exact path={"/error"} element={<LoginError />} />
        <Route exact path={"/incoherence_reporting"} element={isAuthentificated ? <IncoherenceReporting /> : <Homepage />} />
        <Route exact path={"/ransharing"} element={isAuthentificated ? <Ransharing /> : <Homepage />} />
        <Route exact path={"/reporting"} element={isAuthentificated ? <Reporting /> :<Homepage />} />
        {/* <Route exact path={"/devtimeline"} component={<Timeline />} /> */}
      </Routes>
    </HashRouter>
  );
};
