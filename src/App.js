import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Results from "./components/Results";
import Search from "./components/Search";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route component={Search} exact path="/" />
          <Route component={Results} path="/searchResult" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
