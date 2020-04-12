/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import * as constant from "../constant.js";
import CurrencyFormat from "react-currency-format";
import Popup from "../Popup/index.js";
const address = constant.ENDPOINT;

class PaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      modalIsOpen: false,
      modalMsg: "",
      status: "",
      paymentId: 0,
    };
    this.getAllPayment = this.getAllPayment.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.updatePayment = this.updatePayment.bind(this);
  }

  async componentDidMount() {
    const loggedIn = await JSON.parse(localStorage.getItem("userData"));
    if (!loggedIn)
      this.props.history.push({
        pathname: `/`,
      });
    else {
      if (loggedIn.status !== "admin")
        this.props.history.push({
          pathname: `/`,
        });
    }
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

  async updatePayment() {
    const _state = this.state;
    await fetch(`http://${address}/payment_upd`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId: _state.paymentId,
        status: _state.paymentStatus,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        const loggedIn = await JSON.parse(localStorage.getItem("userData"));
        if (responseJson.status === "success") {
          this.closeModal();
          this.getAllPayment(loggedIn.user_id);
        }
      });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div className="cart">
        <Popup
          openModal={this.openModal}
          closeModal={this.closeModal}
          modalIsOpen={this.state.modalIsOpen}
          modalMsg={this.state.modalMsg}
          yesCommand={this.updatePayment}
          buttonType={"choice"}
        />
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
                        {value.user_name}
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
                  {value.payment_status === "Waiting Payment" ? (
                    <button className="normalBtn adminManBtn waitBtn">
                      Waiting Payment
                    </button>
                  ) : value.payment_status === "Items Paid" ? (
                    <button
                      onClick={() =>
                        this.setState({
                          modalIsOpen: true,
                          modalMsg: "Approve that this items already paid?",
                          paymentId: value.payment_id,
                          paymentStatus: "Approved",
                        })
                      }
                      className="normalBtn adminManBtn approveBtn"
                    >
                      Approve
                    </button>
                  ) : value.payment_status === "Approved" ? (
                    <button
                      onClick={() =>
                        this.setState({
                          modalIsOpen: true,
                          modalMsg: "Approve that this items already paid?",
                          paymentId: value.payment_id,
                          paymentStatus: "Process",
                        })
                      }
                      className="normalBtn adminManBtn approveBtn"
                    >
                      Process
                    </button>
                  ) : null}
                  <button className="normalBtn adminManBtn detailsBtn">
                    Details
                  </button>
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
