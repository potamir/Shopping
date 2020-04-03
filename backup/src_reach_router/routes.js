/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { Router } from "@reach/router";

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
      <Router>
        <Homepage path="/" />
        <ItemPage path="item/:id" />
        <Profile path="profile" />
        <Login path="login" />
        <TagsItemPage path="tagsitempage" />
        <Cart path="cart" />
        <Admin path="admin" />
        <ManagerMain path="managermain" />
        <AdminMan path="adminman" />
        <AdPage path="adPage" />
        <AdPageMan path="adpageman" />
        <SignUp path="signup" />
        <ErrorPage default />
      </Router>
    );
  }
}

export default Routes;
