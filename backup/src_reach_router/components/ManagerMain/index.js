/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import ImageUploader from "react-images-upload";
import * as constant from "../constant.js";
import imageCompression from "browser-image-compression";

const fileSize = 10242880;
const address = constant.ENDPOINT;
class ManagerMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: [],
      about: [],
      help: [],
      tag1: [],
      tag2: [],
      tag3: [],
      tag4: [],
      carousel_imgs: [],
      tag_imgs: [],
      preview: true
    };
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitItem = this.submitItem.bind(this);
  }

  async componentDidMount() {
    await this.getItem();
  }

  async onDrop(picture, _state, url, index) {
    let newImg = "";
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    };
    try {
      const compressedFile = await imageCompression(picture[0], options);
      try {
        newImg = await imageCompression.getDataUrlFromFile(compressedFile);
        this.state[_state].splice(index, 1, newImg);
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

  async getItem() {
    fetch(`http://${address}/mainman_get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(async responseJson => {
        await this.state.carousel_imgs.push(
          [responseJson[0].carousel_img1],
          [responseJson[0].carousel_img2],
          [responseJson[0].carousel_img3],
          [responseJson[0].carousel_img4]
        );
        await this.state.tag_imgs.push(
          [responseJson[0].tag1_img],
          [responseJson[0].tag2_img],
          [responseJson[0].tag3_img],
          [responseJson[0].tag4_img]
        );
        await this.setState({
          contact: [responseJson[0].contact_text],
          about: [responseJson[0].about_text],
          help: [responseJson[0].help_text],
          tag1: [responseJson[0].tag1_text],
          tag2: [responseJson[0].tag2_text],
          tag3: [responseJson[0].tag3_text],
          tag4: [responseJson[0].tag4_text]
        });
      });
  }

  async submitItem() {
    const data = this.state;
    console.log(data);
    await fetch(`http://${address}/mainman_post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contact: data.contact,
        about: data.about,
        help: data.help,
        tag1: data.tag1,
        tag2: data.tag2,
        tag3: data.tag3,
        tag4: data.tag4,
        carouselImg1: data.carousel_imgs[0],
        carouselImg2: data.carousel_imgs[1],
        carouselImg3: data.carousel_imgs[2],
        carouselImg4: data.carousel_imgs[3],
        tagImg1: data.tag_imgs[0],
        tagImg2: data.tag_imgs[1],
        tagImg3: data.tag_imgs[2],
        tagImg4: data.tag_imgs[3]
      })
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        if (responseJson.status === "success") {
          window.location.reload(true);
        }
      });
  }

  render() {
    console.log(this.state);
    return (
      <div className="AdminMain">
        <h1 className="AdminHeader">Change Main Menu Text and Image</h1>

        <div>
          <p className="imgUploaderTitle">Carousel Images</p>
          <div className="imgUploaderGroup">
            <ImageUploader
              className="imgUploader"
              withIcon={false}
              buttonText="+"
              withPreview={this.state.preview}
              onChange={(e, u) => this.onDrop(e, "carousel_imgs", u, 0)}
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
              onChange={(e, u) => this.onDrop(e, "carousel_imgs", u, 1)}
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
              onChange={(e, u) => this.onDrop(e, "carousel_imgs", u, 2)}
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
              onChange={(e, u) => this.onDrop(e, "carousel_imgs", u, 3)}
              imgExtension={[".jpg", ".png", ".PNG", ".jpeg"]}
              maxFileSize={fileSize}
              withLabel={false}
              singleImage={true}
            />
          </div>
        </div>
        <div className="PrimTag">
          <div className="Tag">
            <p>TAG 1 :</p>
            <input
              placeholder="Tag of Component"
              onChange={e => this.inputChangeHandler(e, "tag1")}
              value={this.state.tag1}
            />
          </div>
          <div className="Tag">
            <p>TAG 2 :</p>
            <input
              placeholder="Tag of Component"
              onChange={e => this.inputChangeHandler(e, "tag2")}
              value={this.state.tag2}
            />
          </div>
          <div className="Tag">
            <p>TAG 3 :</p>
            <input
              placeholder="Tag of Component"
              onChange={e => this.inputChangeHandler(e, "tag3")}
              value={this.state.tag3}
            />
          </div>
          <div className="Tag">
            <p>TAG 4 :</p>
            <input
              placeholder="Tag of Component"
              onChange={e => this.inputChangeHandler(e, "tag4")}
              value={this.state.tag4}
            />
          </div>
        </div>
        <div>
          <p className="imgUploaderTitle">Tag Images</p>
          <div className="imgUploaderGroup">
            <ImageUploader
              className="imgUploader"
              withIcon={false}
              buttonText="+"
              withPreview={this.state.preview}
              onChange={(e, u) => this.onDrop(e, "tag_imgs", u, 0)}
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
              onChange={(e, u) => this.onDrop(e, "tag_imgs", u, 1)}
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
              onChange={(e, u) => this.onDrop(e, "tag_imgs", u, 2)}
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
              onChange={(e, u) => this.onDrop(e, "tag_imgs", u, 3)}
              imgExtension={[".jpg", ".png", ".PNG", ".jpeg"]}
              maxFileSize={fileSize}
              withLabel={false}
              singleImage={true}
            />
          </div>
        </div>
        <div className="Description">
          <p>Contact Text :</p>
          <textarea
            className="DescTx"
            placeholder="Footer Contact Text"
            onChange={e => this.inputChangeHandler(e, "contact")}
            value={this.state.contact}
          />
        </div>
        <div className="Description">
          <p>About Text :</p>
          <textarea
            className="DescTx"
            placeholder="Footer About Text"
            onChange={e => this.inputChangeHandler(e, "about")}
            value={this.state.about}
          />
        </div>
        <div className="Description">
          <p>Help Text :</p>
          <textarea
            className="DescTx"
            placeholder="Footer Help Text"
            onChange={e => this.inputChangeHandler(e, "help")}
            value={this.state.help}
          />
        </div>
        <div className="submitBtnDiv">
          <button className="submitBtn normalBtn" onClick={this.submitItem}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default ManagerMain;
