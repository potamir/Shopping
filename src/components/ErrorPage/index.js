/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";

class ErrorPage extends Component {
  componentDidMount() {
    document.body.scrollTop = 0;
    document.querySelector(".menu").classList.remove("open");
  }
  render() {
    return <h3 className="error text-center">404(Page Not Found)</h3>;
  }
}

export default withRouter(ErrorPage);
