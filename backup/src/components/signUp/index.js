/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import passwordHash from "password-hash";
import Popup from "../Popup/index.js";
import * as constant from "../constant.js";
import { withRouter } from "react-router-dom";

const address = constant.ENDPOINT;
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: [""],
      fname: [""],
      pass: [""],
      repass: [""],
      address: [""],
      postal: [""],
      phone: [""],
      unameStatus: false,
      modalIsOpen: false,
      modalMsg: ""
    };
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitItem = this.submitItem.bind(this);
    this.checkUnique = this.checkUnique.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  async componentDidMount() {}

  async inputChangeHandler(e, _state) {
    let newValue = e.target.value;
    this.state[_state].splice(0, 1, newValue);
    await this.forceUpdate();
    if (_state === "uname") {
      this.checkUnique();
    }
  }

  async checkUnique() {
    const data = this.state;
    await fetch(`http://${address}/user_check_get`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: data.uname
      })
    })
      .then(response => response.json())
      .then(async responseJson => {
        await this.setState({ unameStatus: responseJson.status });
      });
  }

  async submitItem() {
    const data = this.state;
    if (
      data.uname[0].length > 0 &&
      data.fname[0].length > 0 &&
      data.pass[0].length > 0 &&
      data.repass[0].length > 0 &&
      data.phone[0].length > 0
    ) {
      if (data.pass[0] === data.repass[0]) {
        if (!data.unameStatus) {
          let newPass = passwordHash.generate(data.pass[0]);
          await fetch(`http://${address}/user_post`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userName: data.uname,
              password: newPass.toString(),
              userFull: data.fname,
              userAdd: data.address,
              userPos: data.postal.toString(),
              userPhone: data.phone.toString()
            })
          })
            .then(response => response.json())
            .then(async responseJson => {
              if (responseJson.status === "success") window.location.reload();
            });
        } else
          this.setState({
            modalIsOpen: true,
            modalMsg: "Username already taken"
          });
      } else
        this.setState({
          modalIsOpen: true,
          modalMsg: "Password doesn't match"
        });
    } else
      this.setState({
        modalIsOpen: true,
        modalMsg: "Fill all requirement"
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
      <div className="AdminMain">
        <Popup
          openModal={this.openModal}
          closeModal={this.closeModal}
          modalIsOpen={this.state.modalIsOpen}
          modalMsg={this.state.modalMsg}
          buttonType={"close"}
        />
        <h1 className="AdminHeader">Sign Up</h1>
        <div className="Name">
          <p>*USERNAME :</p>
          <input
            style={{
              backgroundColor: this.state.unameStatus ? "#ec6060" : null
            }}
            placeholder="Unique Username"
            onChange={e => this.inputChangeHandler(e, "uname")}
            value={this.state.uname}
          />
        </div>
        <div className="Name">
          <p>*FULL NAME :</p>
          <input
            placeholder="First and Last Name"
            onChange={e => this.inputChangeHandler(e, "fname")}
            value={this.state.fname}
          />
        </div>
        <div className="Name">
          <p>*PASSWORD :</p>
          <input
            type="password"
            placeholder="Password"
            onChange={e => this.inputChangeHandler(e, "pass")}
            value={this.state.pass}
          />
        </div>
        <div className="Name">
          <p>*REPEAT PASSWORD :</p>
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={e => this.inputChangeHandler(e, "repass")}
            value={this.state.repass}
          />
        </div>
        <div className="Description">
          <p>ADDRESS :</p>
          <textarea
            className="DescTx"
            placeholder="User Address"
            onChange={e => this.inputChangeHandler(e, "address")}
            value={this.state.address}
          />
        </div>
        <div className="Name">
          <p>POSTAL :</p>
          <input
            placeholder="Postal code"
            onChange={e => this.inputChangeHandler(e, "postal")}
            value={this.state.postal}
          />
        </div>
        <div className="Name">
          <p>*PHONE :</p>
          <input
            placeholder="Phone Number"
            onChange={e => this.inputChangeHandler(e, "phone")}
            value={this.state.phone}
          />
        </div>
        <div className="submitBtnDiv">
          <button className="submitBtn normalBtn" onClick={this.submitItem}>
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUp);
