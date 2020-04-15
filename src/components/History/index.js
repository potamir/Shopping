/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import * as constant from "../constant.js";
import CurrencyFormat from "react-currency-format";
import Popup from "../Popup/index.js";
import imageCompression from "browser-image-compression";

const address = constant.ENDPOINT;
const imgsrc = constant.IMGSRC;

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      modalIsOpen: false,
      modalMsg: "",
      popupType: "choice",
      status: "",
      open: [],
      openSet: false,
      paymentId: "",
      paymentStatus: "",
      preview: false,
      pictures: [[]],
      currRow: 0,
    };
    this.getAllPayment = this.getAllPayment.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.updatePayment = this.updatePayment.bind(this);
    this.checkDetails = this.checkDetails.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  async componentDidMount() {
    const loggedIn = await JSON.parse(localStorage.getItem("userData"));
    if (!loggedIn)
      this.props.history.push({
        pathname: `/`,
      });
    await this.getAllPayment(loggedIn.user_id);
    console.log(this.state.data);
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
    if (_state.pictures[0].length > 0) console.log(_state.pictures[0]);
    await fetch(`http://${address}/payment_upd`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId: _state.status,
        status: "Items Paid",
        paymentTrc: _state.pictures[0],
        currPaymentTrc: _state.data[_state.currRow].payment_trc,
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

  checkDetails(status, total, paymentId, index) {
    if (status === "Waiting Payment") {
      this.props.history.push({
        pathname: `/PaymentPage`,
        state: { total: total, status: true, path: "History" },
      });
    } else if (status === "Items Paid") {
      this.setState({
        modalIsOpen: "imgsbm",
        modalMsg: "Update or change the payment receipt?",
        status: paymentId,
        currRow: index,
        popupType: "",
      });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  async onDrop(picture, url, index) {
    let newImg = "";
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 640,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(picture[0], options);
      try {
        newImg = await imageCompression.getDataUrlFromFile(compressedFile);
        this.state.pictures.splice(index, 1, newImg);
        await this.setState({ preview: false });
        this.setState({
          preview: true,
        });
      } catch (error) {
        this.setState({ pictures: [[]] });
      }
    } catch (error) {
      this.setState({ pictures: [[]] });
    }
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
          yesCommand={this.updatePayment}
          buttonType={"imgsbm"}
          preview={this.state.preview}
          onDrop={this.onDrop}
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
                      <button
                        onClick={() =>
                          this.setState({
                            modalIsOpen: true,
                            modalMsg: "Send payment receipt to confirm!",
                            status: value.payment_id,
                            currRow: index,
                            popupType: "choice",
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
                    ) : value.payment_status === "On Process" ? (
                      <button className="normalBtn adminManBtn waitBtn">
                        Items Being Process
                      </button>
                    ) : null}
                    <button
                      onClick={() =>
                        this.checkDetails(
                          value.payment_status,
                          value.total_payment,
                          value.payment_id,
                          index
                        )
                      }
                      className="normalBtn adminManBtn detailsBtn"
                    >
                      Details
                    </button>
                    {value.payment_status === "Waiting Payment" ? (
                      <button className="normalBtn adminManBtn deleteBtn">
                        Cancel
                      </button>
                    ) : null}
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

export default withRouter(History);
