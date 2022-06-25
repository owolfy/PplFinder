import { React, useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "pages";
import { ThemeProvider } from "theme";
import NavBar from "components/NavBar";

const AppRouter = () => {
  const [tabIndex, setTabIndex] = useState();

  return (
    <ThemeProvider>
      <Router>
        <NavBar tabChange={setTabIndex}/>
        <Switch>
          <Route exact path="/">
            <Home tabIndex={tabIndex}/>
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;
