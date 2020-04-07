/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";

import Header from "../Header/index";
import Footer from "../Footer/index";
import "./styles.sass";
import "../../styles/animation.sass";
import * as constant from "../constant.js";
import Routes from "../../routes";

const address = constant.ENDPOINT;
class App extends Component {
  componentDidMount() {
    this.getItem();
    // this.getShipping();
  }
  getItem() {
    fetch(`http://${address}/mainman_get_footer_only`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        await localStorage.setItem("mainman", JSON.stringify(responseJson[0]));
      });
  }

  render() {
    return (
      <div className="wrapper">
        <Header />
        <CSSTransitionGroup
          transitionName="content"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          <div className="appMain">
            <Routes />
          </div>
        </CSSTransitionGroup>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,
};

export default App;
