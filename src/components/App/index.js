/* eslint-disable import/no-unresolved */
import React, { Component, PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Header from "../Header/index";
import Footer from "../Footer/index";
import "./styles.sass";
import "../../styles/animation.sass";
import * as constant from "../constant.js";

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
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(async responseJson => {
        await localStorage.setItem("mainman", JSON.stringify(responseJson[0]));
      });
  }

  getShipping() {
    fetch(`https://api.rajaongkir.com/starter/province?id=12`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        key: "8df3fc61dbed2cccecd359a4ed17eb38"
      }
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log("prov", responseJson);
      });
  }

  render() {
    return (
      <div className="wrapper">
        {this.props.location.pathname === "/adPage" ? null : <Header />}
        <ReactCSSTransitionGroup
          transitionName="content"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          <div key={this.props.location.pathname} className="appMain">
            {this.props.children}
          </div>
        </ReactCSSTransitionGroup>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,
  "location.pathname": PropTypes.string
};

export default App;
