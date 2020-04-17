/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import "./styles.sass";
import * as constant from "../constant.js";
import Loading from "../Loading/index";

const address = constant.ENDPOINT;
class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = { total: 0, paymentDesc: "", loading: false };
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
    await this.setState({ loading: true });
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
          loading: false,
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <Loading display={this.state.loading} />
        <div className="paymentMainDiv">
          <Link
            className="backLink backLinkPay"
            to={{
              pathname: `/${this.props.location.state.path}`,
              query: { param: true, component: "itempage" },
            }}
          >
            <span className="small">
              <svg
                fill="#000000"
                height="13"
                viewBox="0 0 18 15"
                width="13"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 10l5 5 5-5z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </span>
            Back
          </Link>
          <h3 className="paymentTitle">Current Payment</h3>
          <p className="paymentContent">{this.state.paymentDesc}</p>
          <CurrencyFormat
            value={this.state.total}
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            prefix={"Rp. "}
            suffix={",-"}
            renderText={(total) => (
              <p className="paymentTotal">Total:{total}</p>
            )}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(PaymentPage);
