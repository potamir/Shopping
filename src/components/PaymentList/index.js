/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import * as constant from "../constant.js";
import CurrencyFormat from "react-currency-format";
const address = constant.ENDPOINT;

class PaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.getAllPayment = this.getAllPayment.bind(this);
  }

  async componentDidMount() {
    this.getAllPayment();
  }

  async getAllPayment() {
    await fetch(`http://${address}/payment_get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({ data: responseJson });
      });
  }

  render() {
    return (
      <div className="cart">
        <div className="itemEaWrapper">
          {this.state.data.map((value, index) => {
            // const detailsItem = JSON.parse(value.items_oncart);
            console.log(value);
            return (
              <div key={index} className="itemEa">
                <div className="leftDesc">
                  <div className="cImgDiv paymentExp">
                    <div className="paymentDetailsExp">
                      <h3 className="detailsAlignLeft">Name</h3>
                      <p className="detailsAlignLeft">Status</p>
                      <p className="detailsAlignLeft">Type</p>
                    </div>
                  </div>
                  <div className="paymentEaOncart">
                    <div className="paymentDetails">
                      <h3 className="paymentItemDetails">
                        {value.user_full_name}
                      </h3>
                      <p className="paymentItemDetails">
                        {value.payment_status}
                      </p>
                      <p className="paymentItemDetails">{value.payment_type}</p>
                    </div>
                    <div className="paymentOnCart">
                      <CurrencyFormat
                        value={value.total_payment}
                        displayType={"text"}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"Total: Rp."}
                        suffix={",-"}
                        renderText={(curr_value) => (
                          <p className="itemsOnCartDetPrice">{curr_value}</p>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="buttonDiv">
                  <button className="normalBtn adminManBtn approveBtn">Approve</button>
                  <button className="normalBtn adminManBtn detailsBtn">Details</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(PaymentList);
