/* eslint-disable import/no-unresolved */
import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "./components/App/index";
import Main from "./components/Main/index";
import Profile from "./components/Profile/index";
import Login from "./components/Login/index";
import Trades from "./components/Trades/index";
import ItemPage from "./components/ItemPage/index";
import MyItems from "./components/MyItems/index";
import ErrorPage from "./components/ErrorPage/index";
import TagsItemPage from "./components/TagsItemPage/index";
import Cart from "./components/Cart/index";
import Admin from "./components/Admin/index";
import ManagerMain from "./components/ManagerMain/index";
import AdminMan from "./components/AdminMan/index";
import AdPage from "./components/AdPage/index";
import AdPageMan from "./components/AdPageMan/index";
import SignUp from "./components/SignUp/index";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path="item/:id" component={ItemPage} />
    <Route path="profile" component={Profile} />
    <Route path="login" component={Login} />
    <Route path="trades" component={Trades} />
    <Route path="myItems" component={MyItems} />
    <Route path="TagsItemPage" component={TagsItemPage} />
    <Route path="Cart" component={Cart} />
    <Route path="Admin" component={Admin} />
    <Route path="ManagerMain" component={ManagerMain} />
    <Route path="AdminMan" component={AdminMan} />
    <Route path="AdPage" component={AdPage} />
    <Route path="AdPageMan" component={AdPageMan} />
    <Route path="SignUp" component={SignUp} />
    <Route path="*" component={ErrorPage} />
  </Route>
);
