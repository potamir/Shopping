/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Homepage from "./components/Main/index";
import Profile from "./components/Profile/index";
import Login from "./components/Login/index";
import ItemPage from "./components/ItemPage/index";
import ErrorPage from "./components/ErrorPage/index";
import TagsItemPage from "./components/TagsItemPage/index";
import Cart from "./components/Cart/index";
import Admin from "./components/Admin/index";
import ManagerMain from "./components/ManagerMain/index";
import AdminMan from "./components/AdminMan/index";
import AdPage from "./components/AdPage/index";
import AdPageMan from "./components/AdPageMan/index";
import SignUp from "./components/SignUp/index";

class Routes extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/item/:id" component={ItemPage} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/TagsItemPage" component={TagsItemPage} />
          <Route path="/Cart" component={Cart} />
          <Route path="/Admin" component={Admin} />
          <Route path="/ManagerMain" component={ManagerMain} />
          <Route path="/AdminMan" component={AdminMan} />
          <Route path="/AdPage" component={AdPage} />
          <Route path="/AdPageMan" component={AdPageMan} />
          <Route path="/SignUp" component={SignUp} />
          <Route component={ErrorPage} />
        </Switch>
      </main>
    );
  }
}

export default Routes;
