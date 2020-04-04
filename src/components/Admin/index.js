/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import ImageUploader from "react-images-upload";
import * as constant from "../constant.js";
import imageCompression from "browser-image-compression";

const fileSize = 10242880;
const address = constant.ENDPOINT;
class AdminMan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [[], [], [], []],
      preview: true,
      name: [],
      desc: [],
      total: [],
      price: [],
      tag1: [],
      tag2: [],
      tag3: [],
      tag4: [],
      status: "",
      itemId: 0,
      weight: []
    };
    this.onDrop = this.onDrop.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitItem = this.submitItem.bind(this);
  }

  async componentDidMount() {
    const status = this.props.location.state
      ? this.props.location.state.status
      : "curr";
    if (status === "edit") {
      const item = this.props.location.state.item;
      await this.setState({
        pictures: [[item.img1], [item.img2], [item.img3], [item.img4]],
        preview: true,
        name: [item.name],
        desc: [item.description],
        total: [item.total],
        price: [item.price],
        tag1: [item.tag1],
        tag2: [item.tag2],
        tag3: [item.tag3],
        tag4: [item.tag4],
        status: "edit",
        itemId: item.item_id,
        weight: [item.weight]
      });
    }
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
    let newValue = e.target.value;
    if (_state === "price") {
      if (isNaN(parseInt(newValue)) && newValue !== "") {
        newValue = 0;
      }
    }
    this.state[_state].splice(0, 1, newValue);
    this.forceUpdate();
  }

  async submitItem() {
    const data = this.state;
    await fetch(`http://${address}/items_post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: data.name[0],
        description: data.desc,
        total: parseInt(data.total),
        price: parseInt(data.price),
        img1: data.pictures[0],
        img2: data.pictures[1],
        img3: data.pictures[2],
        img4: data.pictures[3],
        tag1: data.tag1,
        tag2: data.tag2,
        tag3: data.tag3,
        tag4: data.tag4,
        status: data.status,
        itemId: data.itemId,
        weight: data.weight
      })
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        if (responseJson.status === "success") {
          if (this.state.status === "edit")
            this.props.history.push("/AdminMan");
          else window.location.reload();
        }
      });
  }

  render() {
    return (
      <div className="AdminMain">
        <h1 className="AdminHeader">ADD NEW ITEM</h1>
        <div className="NameField">
          <div className="Name">
            <p>NAME :</p>
            <input
              placeholder="Name of the Product"
              onChange={e => this.inputChangeHandler(e, "name")}
              value={this.state.name}
            />
          </div>
          <div className="NPL">
            <p>PRICE(Rupiah) :</p>
            <input
              placeholder="Item Price"
              onChange={e => this.inputChangeHandler(e, "price")}
              value={this.state.price}
            />
          </div>
          <div className="NPL">
            <p>TOTAL :</p>
            <input
              placeholder="Total Quantity"
              onChange={e => this.inputChangeHandler(e, "total")}
              value={this.state.total}
            />
          </div>
          <div className="NPL">
            <p>WEIGHT(gram) :</p>
            <input
              placeholder="Item Weight"
              onChange={e => this.inputChangeHandler(e, "weight")}
              value={this.state.weight}
            />
          </div>
        </div>
        <div className="imgUploaderGroup">
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
          <ImageUploader
            className="imgUploader"
            withIcon={false}
            buttonText="+"
            withPreview={this.state.preview}
            onChange={(e, u) => this.onDrop(e, u, 1)}
            imgExtension={[".jpg", ".png", ".PNG", ".jpeg"]}
            maxFileSize={fileSize}
            withLabel={false}
            singleImage={true}
          />
          <ImageUploader
            className="imgUploader"
            withIcon={false}
            buttonText="+"
            withPreview={this.state.preview}
            onChange={(e, u) => this.onDrop(e, u, 2)}
            imgExtension={[".jpg", ".png", ".PNG", ".jpeg"]}
            maxFileSize={fileSize}
            withLabel={false}
            singleImage={true}
          />
          <ImageUploader
            className="imgUploader"
            withIcon={false}
            buttonText="+"
            withPreview={this.state.preview}
            onChange={(e, u) => this.onDrop(e, u, 3)}
            imgExtension={[".jpg", ".png", ".PNG", ".jpeg"]}
            maxFileSize={fileSize}
            withLabel={false}
            singleImage={true}
          />
        </div>
        <div className="Description">
          <p>DESCRIPTION :</p>
          <textarea
            className="DescTx"
            placeholder="Description of Product"
            onChange={e => this.inputChangeHandler(e, "desc")}
            value={this.state.desc}
          />
        </div>
        <div className="PrimTag">
          <div className="Tag">
            <p>TAG 1 :</p>
            <input
              placeholder="Tag of Product"
              onChange={e => this.inputChangeHandler(e, "tag1")}
              value={this.state.tag1}
            />
          </div>
          <div className="Tag">
            <p>TAG 2 :</p>
            <input
              placeholder="Tag of Product"
              onChange={e => this.inputChangeHandler(e, "tag2")}
              value={this.state.tag2}
            />
          </div>
          <div className="Tag">
            <p>TAG 3 :</p>
            <input
              placeholder="Tag of Product"
              onChange={e => this.inputChangeHandler(e, "tag3")}
              value={this.state.tag3}
            />
          </div>
          <div className="Tag">
            <p>TAG 4 :</p>
            <input
              placeholder="Tag of Product"
              onChange={e => this.inputChangeHandler(e, "tag4")}
              value={this.state.tag4}
            />
          </div>
        </div>
        <div className="submitBtnDiv">
          <button className="submitBtn normalBtn" onClick={this.submitItem}>
            {this.state.status === "edit"
              ? "Change Item's Data"
              : "Add New Item"}
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(AdminMan);
