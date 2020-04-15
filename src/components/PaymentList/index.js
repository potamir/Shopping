/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import * as constant from "../constant.js";
import CurrencyFormat from "react-currency-format";
import Popup from "../Popup/index.js";

const address = constant.ENDPOINT;
const imgsrc = constant.IMGSRC;

class PaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      modalIsOpen: false,
      modalMsg: "",
      status: "",
      paymentId: 0,
      open: [],
      openSet: false,
      paymentStatus: "",
      image: "",
      popupType: "choice",
    };
    this.getAllPayment = this.getAllPayment.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.updatePayment = this.updatePayment.bind(this);
    this.checkDetails = this.checkDetails.bind(this);
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

  checkDetails(status, index) {
    console.log(this.state.data[index].payment_trc);
    if (status === "Items Paid") {
      this.setState({
        modalIsOpen: true,
        modalMsg: "Receipt Image",
        image: this.state.data[index].payment_trc,
        popupType: "imgdis",
      });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    let open = [];
    return (
      <div className="cart">
        <Popup
          openModal={this.openModal}
          closeModal={this.closeModal}
          modalIsOpen={this.state.modalIsOpen}
          modalMsg={this.state.modalMsg}
          image={this.state.image}
          buttonType={this.state.popupType}
        />
        <div className="itemEaWrapper">
          {this.state.data.map((value, index) => {
            open.push(false);
            if (!this.state.openSet && index === this.state.data.length - 1) {
              this.setState({ open: open, openSet: true });
            }
            const detailsItem = JSON.parse(value.items_oncart);
            return (
              <div key={index}>
                <div
                  className={`itemEa ${
                    index % 2 == 0 ? "itemEaHistCont" : null
                  }`}
                >
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
                        <p className="paymentItemDetails">
                          {value.payment_type}
                        </p>
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
                            popupType: "choice",
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
                            modalMsg: "Process the items shipping?",
                            paymentId: value.payment_id,
                            paymentStatus: "On Process",
                            popupType: "choice",
                          })
                        }
                        className="normalBtn adminManBtn approveBtn"
                      >
                        Process
                      </button>
                    ) : null}
                    <button
                      onClick={() =>
                        this.checkDetails(value.payment_status, index)
                      }
                      className="normalBtn adminManBtn detailsBtn"
                    >
                      Details
                    </button>
                  </div>
                </div>
                <div
                  className={`itemEaOpen ${
                    index % 2 == 0 ? "itemEaOpenEven" : null
                  }`}
                  onClick={() => {
                    this.state.open.splice(index, 1, !this.state.open[index]);
                    this.forceUpdate();
                  }}
                >
                  <p className="itemEaFont">{`CLICK TO ${
                    this.state.open[index] ? "CLOSE" : "EXPAND"
                  }`}</p>
                </div>
                {this.state.open[index] ? (
                  <div className="itemEaHistWra">
                    {detailsItem.map((eaVal, eaIndex) => {
                      const total = eaVal.price * parseInt(eaVal.onCart);
                      return (
                        <div key={eaIndex} className="itemEaHist">
                          <div className="leftDesc">
                            <div className="cImgDiv">
                              <img
                                src={`${imgsrc}${eaVal.img}`}
                                className="cartIcon"
                              />
                            </div>
                            <div className="itemEaOnCart">
                              <div>
                                <h3>{eaVal.name}</h3>
                              </div>
                              <div className="itemsOnCart">
                                <p className="itemsOnCartDet">
                                  {eaVal.onCart} Item
                                  {eaVal.onCart > 1 ? "s" : null}
                                </p>
                                <CurrencyFormat
                                  value={eaVal.price}
                                  displayType={"text"}
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  prefix={"Price: Rp."}
                                  suffix={",-"}
                                  renderText={(curr_value) => (
                                    <p className="itemsOnCartDetPrice">
                                      {curr_value}
                                    </p>
                                  )}
                                />
                                <CurrencyFormat
                                  value={total}
                                  displayType={"text"}
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  prefix={"Total: Rp."}
                                  suffix={",-"}
                                  renderText={(curr_value) => (
                                    <p className="itemsOnCartDetPrice">
                                      {curr_value}
                                    </p>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(PaymentList);
