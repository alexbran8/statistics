import React from "react";
import { useSelector } from "react-redux";


import LoginError from "./components/LoginError";
import Homepage from "./components/Homepage";


import IncoherenceReporting from "./components/IncoherenceReporting";
import Reporting from "./components/Reporting/Reporting";

import { Ransharing } from "./components/Ransharing/Ransharing";
import { Ransharing4G } from "./components/Ransharing_4G/Ransharing_4G";

import { Header } from "./components/Header/Header";
import { HashRouter, Route, Routes } from "react-router-dom";
import { config } from "./config"

import { Home } from "react-feather";
import { Traitment } from "./components/Traitment/Traitment";

export const AppRouter = (props) => {
  const user = useSelector((state) => ({ auth: state.auth }));
  const isAuthentificated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <HashRouter  {...props} >
      <Header />
      <Routes>
        <Route exact path={"/"} element={<Homepage />} />
        <Route exact path={"/error"} element={<LoginError />} />
        <Route exact path={"/incoherence_reporting"} element={isAuthentificated ? <IncoherenceReporting /> : <Homepage />} />
        <Route exact path={"/ransharing"} element={isAuthentificated ? <Ransharing /> : <Homepage />} />
        <Route exact path={"/ransharing_4g"} element={isAuthentificated ? <Ransharing4G /> : <Homepage />} />
        <Route exact path={"/reporting"} element={isAuthentificated ? <Reporting /> : <Homepage />} />
        <Route exact path={"/traitment"} element={isAuthentificated ? <Traitment /> : <Homepage />} />
      </Routes>
    </HashRouter>
  );
};
