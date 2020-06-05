/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import ImageUploader from "react-images-upload";
import * as constant from "../constant.js";
import imageCompression from "browser-image-compression";
import Loading from "../Loading/index";
import Popup from "../Popup/index.js";
import CropImage from "../CropImage/index";

const fileSize = 10242880;
const address = constant.ENDPOINT;
const imgsrc = constant.IMGSRC;
class AdminMan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [[], [], [], []],
      pictures_temp: [],
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
      weight: [],
      loading: false,
      modalIsOpen: false,
      modalMsg: "",
      imageToCrop: "",
      indexToCrop: 0,
      stateToCrop: "",
      ratio: 3 / 4,
    };
    this.onDrop = this.onDrop.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitItem = this.submitItem.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.openCropModal = this.openCropModal.bind(this);
    this.updatePictures = this.updatePictures.bind(this);
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
    const status = this.props.location.state
      ? this.props.location.state.status
      : "curr";
    if (status === "edit") {
      const item = this.props.location.state.item;
      let newImg = [item.img1, item.img2, item.img3, item.img4];
      if (!newImg[0]) newImg.splice(0, 1, "NoImage.png");
      if (!newImg[1]) newImg.splice(1, 1, "NoImage.png");
      if (!newImg[2]) newImg.splice(2, 1, "NoImage.png");
      if (!newImg[3]) newImg.splice(3, 1, "NoImage.png");
      await this.setState({
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
        weight: [item.weight],
        pictures_temp: newImg,
        pictures: [item.img1, item.img2, item.img3, item.img4],
      });
    }
  }

  async onDrop(picture, url, index) {
    await this.setState({ loading: true });
    const prevImage = this.state.pictures_temp[index];
    // try {
    //   const compressedFile = await imageCompression(picture[0], options);
    if (url[0]) {
      // newImg = await imageCompression.getDataUrlFromFile(compressedFile);
      await this.openCropModal(url[0], index, "pictures", this.state.ratio);
    } else {
      if (this.state.status === "edit")
        this.state.pictures.splice(
          index,
          1,
          prevImage === "NoImage.png" ? "" : prevImage
        );
      else this.state.pictures.splice(index, 1, "");
    }
    // } catch (error) {
    //   this.state[_state].splice(
    //     index,
    //     1,
    //     prevImage[0] === "NoImage.png" ? "" : prevImage
    //   );
    // }
    this.setState({ loading: false });
  }

  async updatePictures(newImage) {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    await fetch(newImage)
      .then((res) => res.blob())
      .then(async (result) => {
        let newImg = "";
        const compressedFile = await imageCompression(result, options);
        newImg = await imageCompression.getDataUrlFromFile(compressedFile);
        this.state[this.state.stateToCrop].splice(
          this.state.indexToCrop,
          1,
          newImg
        );
      });
    await this.setState({ preview: false });
    this.setState({ preview: true });
    this.closeCropModal();
    console.log(this.state);
  }

  inputChangeHandler(e, _state) {
    let newValue = e.target.value;
    let noSpecialChar = true;
    let isNumber = true;
    console.log(newValue);
    for (let i = 0; i < newValue.length; i++) {
      if (newValue[i] === "'" || newValue[i] === "\\") noSpecialChar = false;
      if (isNaN(parseInt(newValue[i])) && newValue[i] !== "") isNumber = false;
    }
    if (!noSpecialChar) {
      this.setState({
        modalIsOpen: true,
        modalMsg: "Apostrophe(') and Back Slash(\\) Character are not allowed",
      });
    } else {
      if (_state === "price" || _state === "weight" || _state === "total") {
        if (!isNumber) {
          newValue = 0;
        }
      }
      this.state[_state].splice(0, 1, newValue);
      this.forceUpdate();
    }
  }

  async submitItem() {
    const data = this.state;
    let requestTo = "items_post";
    const status = this.props.location.state
      ? this.props.location.state.status
      : "curr";
    if (status === "edit") requestTo = "items_post_upd";
    if (data.pictures[0][0] && data.pictures[1][0]) {
      await this.setState({ loading: true });
      await fetch(`http://${address}/${requestTo}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
          itemId: data.itemId,
          weight: data.weight,
        }),
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          if (responseJson.status === "success") {
            if (this.state.status === "edit")
              this.props.history.push("/AdminMan");
            else window.location.reload();
          }
        });
      console.log(data.pictures);
    } else
      this.setState({
        modalIsOpen: true,
        modalMsg: "The first two image is required!",
      });
  }

  async removeImage(index) {
    await this.state.pictures.splice(index, 1, "");
    await this.state.pictures_temp.splice(index, 1, "NoImage.png");
    this.forceUpdate();
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  closeCropModal() {
    this.setState({ modalOpened: false });
    document.body.classList.remove("modal-opened");
    document.body.style.marginRight = 0;
  }

  getCropModal() {
    if (this.state.modalOpened) {
      return (
        <CropImage
          openClass="open"
          close={this.closeCropModal.bind(this)}
          image={this.state.imageToCrop}
          updatePictures={this.updatePictures}
          ratio={this.state.ratio}
        />
      );
    } else {
      return;
    }
  }

  async openCropModal(image, index, _state, ratio) {
    const scrollBar = document.querySelector(".scrollbar-measure");
    const scrollBarWidth = scrollBar.offsetWidth - scrollBar.clientWidth;
    document.body.classList.add("modal-opened");
    document.body.style.marginRight = `${scrollBarWidth}px`;
    await this.setState({
      modalOpened: true,
      imageToCrop: image,
      indexToCrop: index,
      stateToCrop: _state,
      ratio: ratio,
    });
  }

  render() {
    return (
      <React.Fragment>
        <Popup
          openModal={this.openModal}
          closeModal={this.closeModal}
          modalIsOpen={this.state.modalIsOpen}
          modalMsg={this.state.modalMsg}
          buttonType={"close"}
        />
        <Loading display={this.state.loading} />
        <div className="AdminMain">
          {this.getCropModal()}
          <h1 className="AdminHeader">ADD NEW ITEM</h1>
          <div className="NameField">
            <div className="Name">
              <p>NAME :</p>
              <input
                placeholder="Name of the Product"
                onChange={(e) => this.inputChangeHandler(e, "name")}
                value={this.state.name}
                readOnly={this.state.status === "edit"}
              />
            </div>
            <div className="NPL">
              <p>PRICE(Rupiah) :</p>
              <input
                placeholder="Item Price"
                onChange={(e) => this.inputChangeHandler(e, "price")}
                value={this.state.price}
              />
            </div>
            <div className="NPL">
              <p>TOTAL :</p>
              <input
                placeholder="Total Quantity"
                onChange={(e) => this.inputChangeHandler(e, "total")}
                value={this.state.total}
              />
            </div>
            <div className="NPL">
              <p>WEIGHT(gram) :</p>
              <input
                placeholder="Item Weight"
                onChange={(e) => this.inputChangeHandler(e, "weight")}
                value={this.state.weight}
              />
            </div>
          </div>
          {this.state.status === "edit" ? (
            <div className="imgUploaderGroup">
              <div className="imgUploader">
                <img
                  src={`${imgsrc}${this.state.pictures_temp[0]}`}
                  onClick={() => this.removeImage(0)}
                  className="admImg"
                />
              </div>
              <div className="imgUploader">
                <img
                  src={`${imgsrc}${this.state.pictures_temp[1]}`}
                  onClick={() => this.removeImage(1)}
                  className="admImg"
                />
              </div>
              <div className="imgUploader removeImage">
                <img
                  src={`${imgsrc}${this.state.pictures_temp[2]}`}
                  onClick={() => this.removeImage(2)}
                  className="admImg"
                />
              </div>
              <div className="imgUploader removeImage">
                <img
                  src={`${imgsrc}${this.state.pictures_temp[3]}`}
                  onClick={() => this.removeImage(3)}
                  className="admImg"
                />
              </div>
            </div>
          ) : null}
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
              onChange={(e) => this.inputChangeHandler(e, "desc")}
              value={this.state.desc}
            />
          </div>
          <div className="PrimTag">
            <div className="Tag">
              <p>TAG 1 :</p>
              <input
                placeholder="Tag of Product"
                onChange={(e) => this.inputChangeHandler(e, "tag1")}
                value={this.state.tag1}
              />
            </div>
            <div className="Tag">
              <p>TAG 2 :</p>
              <input
                placeholder="Tag of Product"
                onChange={(e) => this.inputChangeHandler(e, "tag2")}
                value={this.state.tag2}
              />
            </div>
            <div className="Tag">
              <p>TAG 3 :</p>
              <input
                placeholder="Tag of Product"
                onChange={(e) => this.inputChangeHandler(e, "tag3")}
                value={this.state.tag3}
              />
            </div>
            <div className="Tag">
              <p>TAG 4 :</p>
              <input
                placeholder="Tag of Product"
                onChange={(e) => this.inputChangeHandler(e, "tag4")}
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
      </React.Fragment>
    );
  }
}

export default withRouter(AdminMan);
