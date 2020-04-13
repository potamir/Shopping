/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import "./styles.sass";
import * as constant from "../constant.js";

const address = constant.ENDPOINT;
class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = { total: 0, paymentDesc: "" };
    this.getOrigin = this.getOrigin.bind(this);
  }

  async componentDidMount() {
    const status = this.props.location.state
      ? this.props.location.state.status
      : false;
    if (status) this.setState({ total: this.props.location.state.total });
    else
      this.props.history.push({
        pathname: `/`,
      });
    this.getOrigin();
  }

  async getOrigin() {
    await fetch(`http://${address}/origin_get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({
          paymentDesc: [responseJson[0].payment_desc],
        });
      });
  }

  render() {
    return (
      <div className="paymentMainDiv">
        <h3 className="paymentTitle">Current Payment</h3>
        <p className="paymentContent">{this.state.paymentDesc}</p>
        <CurrencyFormat
          value={this.state.total}
          displayType={"text"}
          thousandSeparator="."
          decimalSeparator=","
          prefix={"Rp. "}
          suffix={",-"}
          renderText={(total) => <p className="paymentTotal">Total:{total}</p>}
        />
      </div>
    );
  }
}

export default withRouter(PaymentPage);
