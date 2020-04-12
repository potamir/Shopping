/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import * as constant from "../constant.js";
import CurrencyFormat from "react-currency-format";
import Popup from "../Popup/index.js";
const address = constant.ENDPOINT;

class History extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], modalIsOpen: false, modalMsg: "", status: "" };
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
    this.getAllPayment(loggedIn.user_id);
  }

  async getAllPayment(userId) {
    await fetch(`http://${address}/payment_get_user`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
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
        paymentId: _state.status,
        status: "Items Paid",
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
            const detailsItem = JSON.parse(value.items_oncart);
            return (
              <div key={index} className="itemEa">
                <div className="leftDesc">
                  <div className="cImgDiv paymentExp">
                    <div className="paymentDetailsExp">
                      <h3 className="detailsAlignLeft">Count</h3>
                      <p className="detailsAlignLeft">Status</p>
                      <p className="detailsAlignLeft">Type</p>
                    </div>
                  </div>
                  <div className="paymentEaOncart">
                    <div className="paymentDetails">
                      <h3 className="paymentItemDetails">
                        {detailsItem.length} item
                        {detailsItem.length > 1 ? "s" : null}
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
                    <button
                      onClick={() =>
                        this.setState({
                          modalIsOpen: true,
                          modalMsg: "Confirm that this items already paid?",
                          status: value.payment_id,
                        })
                      }
                      className="normalBtn adminManBtn approveBtn"
                    >
                      Confirm
                    </button>
                  ) : value.payment_status === "Items Paid" ? (
                    <button className="normalBtn adminManBtn waitBtn">
                      Waiting Approval
                    </button>
                  ) : value.payment_status === "Approved" ? (
                    <button className="normalBtn adminManBtn waitBtn">
                      Approved
                    </button>
                  ) : value.payment_status === "Process" ? (
                    <button className="normalBtn adminManBtn waitBtn">
                      Items Being Process
                    </button>
                  ) : null}
                  <button className="normalBtn adminManBtn detailsBtn">
                    Details
                  </button>
                  {value.payment_status === "Waiting Payment" ? (
                    <button className="normalBtn adminManBtn deleteBtn">
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(History);
