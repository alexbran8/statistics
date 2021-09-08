import React, { Component, Suspense  } from "react";
import { AppRouter } from "./AppRouter";

class App extends Component {
  render() {
    return   <Suspense fallback="loading"><AppRouter /></Suspense>;
  }
}

export default App;
