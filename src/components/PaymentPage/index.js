/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import * as constant from "../constant.js";

const address = constant.ENDPOINT;


class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return (
      <div>
        <p>tes</p>
      </div>
    );
  }
}

export default withRouter(PaymentPage);
