/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
// import * as constant from "../constant.js";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// const imgsrc = constant.IMGSRC;

class CropImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crop: {
        unit: "%",
        width: 30,
        aspect: this.props.ratio,
      },
    };
    this.close = this.close.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onCropChange = this.onCropChange.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
  }

  async componentDidMount() {
    console.log(this.props.image);
    setTimeout(() => {
      this.modalWrapper.classList.add(this.props.openClass);
    }, 50);
  }

  async close() {
    this.modalWrapper.classList.remove(this.props.openClass);
    setTimeout(() => {
      this.props.close();
    }, 850);
  }

  // If you setState the crop in here you should return false.
  onImageLoaded(image) {
    this.imageRef = image;
  }

  onCropComplete(crop) {
    this.makeClientCrop(crop);
  }

  onCropChange(crop) {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "croppedimage.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    return canvas.toDataURL("image/png");
    // return new Promise((resolve, reject) => {
    //   canvas.toBlob((blob) => {
    //     if (!blob) {
    //       //reject(new Error('Canvas is empty'));
    //       console.error("Canvas is empty");
    //       return;
    //     }
    //     blob.name = fileName;
    //     window.URL.revokeObjectURL(this.fileUrl);
    //     this.fileUrl = window.URL.createObjectURL(blob);
    //     resolve(this.fileUrl);
    //   }, "image/jpeg");
    // });
  }

  render() {
    const { crop, croppedImageUrl } = this.state;
    const _props = this.props;
    return (
      <div
        className="addItemWrapper"
        ref={(node) => {
          this.modalWrapper = node;
        }}
      >
        <div className="hider">
          <div className="crop-btn-div">
            <button
              className="cropBtn normalBtn"
              onClick={() => {
                _props.updatePictures(croppedImageUrl);
              }}
            >
              Crop
            </button>
          </div>
        </div>
        <div className="modal crop-modal">
          <div className="image-crop">
            <ReactCrop
              src={_props.image}
              crop={crop}
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(CropImage);
