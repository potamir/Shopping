/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
// import { browserHistory } from "react-router";
import "./styles.sass";
import ImageUploader from "react-images-upload";
import * as constant from "../constant.js";
import imageCompression from "browser-image-compression";

const fileSize = 10242880;
const address = constant.ENDPOINT;
class AdPageMan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      adDesc: [],
      adPhone: []
    };
    this.onDrop = this.onDrop.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitItem = this.submitItem.bind(this);
  }

  componentDidMount() {
    this.getItem();
  }

  async submitItem() {
    console.log(this.state);
    const data = this.state;
    await fetch(`http://${address}/adman_post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        adImg: data.pictures[0],
        adTxt: data.adDesc,
        adPhn: data.adPhone
      })
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        if (responseJson.status === "success") window.location.reload();
      });
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
          pictures: [responseJson[0].ad_img],
          adDesc: [responseJson[0].ad_msg],
          adPhone: [responseJson[0].ad_phone]
        });
      });
  }

  async onDrop(picture, url, index) {
    let newImg = "";
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 640,
      useWebWorker: true
    };
    try {
      const compressedFile = await imageCompression(picture[0], options);
      try {
        newImg = await imageCompression.getDataUrlFromFile(compressedFile);
        this.state.pictures.splice(index, 1, newImg);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
    await this.setState({ preview: false });
    this.setState({
      preview: true
    });
  }
  inputChangeHandler(e, _state) {
    this.state[_state].splice(0, 1, e.target.value);
  }

  render() {
    return (
      <div className="adMain">
        <div className="adImgDiv">
          <p className="adImgTitle">Advertisement Image</p>
          <ImageUploader
            className="imgUploader"
            withIcon={false}
            buttonText="+"
            withPreview={this.state.preview}
            onChange={(e, u) => this.onDrop(e, u, 0)}
            imgExtension={[".jpg", ".png", ".PNG", ".jpeg"]}
            maxFileSize={fileSize}
            withLabel={false}
            singleImage={true}
          />
        </div>
        <div className="descAdDiv">
          <p>Phone Number</p>
          <input
            placeholder="08xxxxxx"
            onChange={e => this.inputChangeHandler(e, "adPhone")}
            value={this.state.adPhone}
          />
        </div>
        <div className="descAdDiv">
          <p>Advertisement Text</p>
          <textarea
            className="DescTx"
            placeholder="Advertisement Text"
            onChange={e => this.inputChangeHandler(e, "adDesc")}
            value={this.state.adDesc}
          />
        </div>
        <div className="buttonDiv">
          <button className="submitBtn button" onClick={this.submitItem}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default AdPageMan;
