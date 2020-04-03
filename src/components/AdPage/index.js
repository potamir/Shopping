/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import * as constant from "../constant.js";
import { withRouter } from "react-router-dom";

const address = constant.ENDPOINT;
class AdPage extends Component {
  constructor(props) {
    super(props);
    this.state = { adImg: "", adMsg: "", adPhone: "", link: "" };
    this.onClickImg = this.onClickImg.bind(this);
  }
  componentDidMount() {
    this.getItem();
  }

  async getItem() {
    fetch(`http://${address}/adman_get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(async responseJson => {
        this.setState({
          adImg: responseJson[0].ad_img,
          adMsg: responseJson[0].ad_msg,
          adPhone: responseJson[0].ad_phone
        });
      });
  }

  async onClickImg() {
    const newMsg = this.state.adMsg.split(" ");
    let tempLink = `https://wa.me/${this.state.adPhone}?text=`;
    for (let i = 0; i < newMsg.length; i++) {
      tempLink = `${tempLink}${newMsg[i]}%20`;
    }
    console.log(tempLink);
    window.location.href = `${tempLink}`;
  }

  render() {
    return (
      <div className="adImgD">
        <img
          className="adImg"
          src={this.state.adImg}
          onClick={this.onClickImg}
        />
      </div>
    );
  }
}

export default withRouter(AdPage);
