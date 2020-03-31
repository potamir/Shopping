/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { browserHistory } from "react-router";
import passwordHash from "password-hash";
import Popup from "../Popup/index.js";
import "./styles.sass";
import * as constant from "../constant.js";

const address = constant.ENDPOINT;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: [""],
      pass: [""],
      modalIsOpen: false,
      modalMsg: ""
    };
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.logIn = this.logIn.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  componentDidMount() {
    const status = this.props.location.state;
    browserHistory.push({
      pathname: `/login`,
      state: "loggedout"
    });
    if (status === "logout") window.location.reload();
    document.body.scrollTop = 0;
    document.querySelector(".menu").classList.remove("open");
  }

  async inputChangeHandler(e, _state) {
    let newValue = e.target.value;
    this.state[_state].splice(0, 1, newValue);
    await this.forceUpdate();
  }

  signUp() {
    browserHistory.push({
      pathname: `/signup`
    });
  }

  async logIn() {
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
        if (responseJson.status) {
          if (
            passwordHash.verify(data.pass[0], responseJson.data[0].password)
          ) {
            await localStorage.setItem(
              "userData",
              JSON.stringify(responseJson.data[0])
            );
            browserHistory.push({
              pathname: `/`,
              state: "login"
            });
          } else
            this.setState({ modalMsg: "Wrong Password", modalIsOpen: true });
        } else this.setState({ modalMsg: "User Not Found", modalIsOpen: true });
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
      <div className="loginWrapper">
        <Popup
          openModal={this.openModal}
          closeModal={this.closeModal}
          modalIsOpen={this.state.modalIsOpen}
          modalMsg={this.state.modalMsg}
          buttonType={"close"}
        />
        <h3 className="loginHeading text-center">Login or Sign Up</h3>
        <div className="Name LoginUserNP">
          <p>USERNAME</p>
          <input
            className="loginInp"
            placeholder="Unique Username"
            onChange={e => this.inputChangeHandler(e, "uname")}
            value={this.state.uname}
          />
        </div>
        <div className="Name LoginUserNP">
          <p>PASSWORD</p>
          <input
            className="loginInp"
            type="password"
            placeholder="User Password"
            onChange={e => this.inputChangeHandler(e, "pass")}
            value={this.state.pass}
          />
        </div>
        <div className="btnWrapper">
          <button className="loginBtn normalBtn" onClick={this.logIn}>
            Login
          </button>
          <button className="loginBtn normalBtn" onClick={this.signUp}>
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
