/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import ImageUploader from "react-images-upload";
import * as constant from "../constant.js";
import imageCompression from "browser-image-compression";
import Loading from "../Loading/index";

const fileSize = 10242880;
const address = constant.ENDPOINT;
const imgsrc = constant.IMGSRC;
class ManagerMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: [],
      about: [],
      help: [],
      tags: [],
      tagsCaro: [],
      titles: [],
      titlesCaro: [],
      carousel_imgs: [],
      carousel_imgs_temp: [],
      tag_imgs_temp: [],
      tag_imgs: [],
      preview: true,
      loading: false,
    };
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitItem = this.submitItem.bind(this);
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
    await this.getItem();
  }

  async onDrop(picture, _state, url, index) {
    await this.setState({ loading: true });
    let newImg = "";
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
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
      this.state;
      this.state[_state].splice(index, 1, this.state[`${_state}_temp`][index]);
    }
    await this.setState({ preview: false });
    this.setState({
      preview: true,
      loading: false,
    });
    console.log(this.state);
  }

  inputChangeHandler(e, _state, index) {
    let newValue = e.target.value;
    if (_state === "price") {
      if (isNaN(parseInt(newValue)) && newValue !== "") {
        newValue = 0;
      }
    }
    this.state[_state].splice(index, 1, newValue);
    this.forceUpdate();
  }

  async getItem() {
    await this.setState({ loading: true });
    fetch(`http://${address}/mainman_get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
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
        await this.state.carousel_imgs_temp.push(
          [responseJson[0].carousel_img1],
          [responseJson[0].carousel_img2],
          [responseJson[0].carousel_img3],
          [responseJson[0].carousel_img4]
        );
        await this.state.tag_imgs_temp.push(
          [responseJson[0].tag1_img],
          [responseJson[0].tag2_img],
          [responseJson[0].tag3_img],
          [responseJson[0].tag4_img]
        );
        await this.state.tags.push(
          [responseJson[0].tag1_text],
          [responseJson[0].tag2_text],
          [responseJson[0].tag3_text],
          [responseJson[0].tag4_text]
        );
        await this.state.tagsCaro.push(
          [responseJson[0].tag1_carousel],
          [responseJson[0].tag2_carousel],
          [responseJson[0].tag3_carousel],
          [responseJson[0].tag4_carousel]
        );
        await this.state.titles.push(
          [responseJson[0].title1_tag],
          [responseJson[0].title2_tag],
          [responseJson[0].title3_tag],
          [responseJson[0].title4_tag]
        );
        await this.state.titlesCaro.push(
          [responseJson[0].title1_carousel],
          [responseJson[0].title2_carousel],
          [responseJson[0].title3_carousel],
          [responseJson[0].title4_carousel]
        );
        await this.setState({
          contact: [responseJson[0].contact_text],
          about: [responseJson[0].about_text],
          help: [responseJson[0].help_text],
          loading: false,
        });
      });
  }

  async submitItem() {
    await this.setState({ loading: true });
    const data = this.state;
    console.log(data);
    await fetch(`http://${address}/mainman_post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: data.contact,
        about: data.about,
        help: data.help,
        tags: data.tags,
        tagsCaro: data.tagsCaro,
        titles: data.titles,
        titlesCaro: data.titlesCaro,
        carouselImg1: data.carousel_imgs[0],
        carouselImg2: data.carousel_imgs[1],
        carouselImg3: data.carousel_imgs[2],
        carouselImg4: data.carousel_imgs[3],
        tagImg1: data.tag_imgs[0],
        tagImg2: data.tag_imgs[1],
        tagImg3: data.tag_imgs[2],
        tagImg4: data.tag_imgs[3],
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        if (responseJson.status === "success") {
          window.location.reload(true);
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        <Loading display={this.state.loading} />
        <div className="AdminMain">
          <h1 className="AdminHeader">Change Main Menu Text and Image</h1>
          <div>
            <p className="imgUploaderTitle">Carousel Settings</p>
            <div className="PrimTag">
              <div className="Tag">
                <p className="titleEaSetti">TITLE 1 :</p>
                <input
                  placeholder="Title on Carousel Page"
                  onChange={(e) => this.inputChangeHandler(e, "titlesCaro", 0)}
                  value={this.state.titlesCaro[0]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TITLE 2 :</p>
                <input
                  placeholder="Title on Carousel Page"
                  onChange={(e) => this.inputChangeHandler(e, "titlesCaro", 1)}
                  value={this.state.titlesCaro[1]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TITLE 3 :</p>
                <input
                  placeholder="Title on Carousel Page"
                  onChange={(e) => this.inputChangeHandler(e, "titlesCaro", 2)}
                  value={this.state.titlesCaro[2]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TITLE 4 :</p>
                <input
                  placeholder="Title on Carousel Page"
                  onChange={(e) => this.inputChangeHandler(e, "titlesCaro", 3)}
                  value={this.state.titlesCaro[3]}
                />
              </div>
            </div>
            <div className="imgUploaderGroup">
              <img
                src={`${imgsrc}${this.state.carousel_imgs_temp[0]}`}
                className="imgUploader"
              />
              <img
                src={`${imgsrc}${this.state.carousel_imgs_temp[1]}`}
                className="imgUploader"
              />
              <img
                src={`${imgsrc}${this.state.carousel_imgs_temp[2]}`}
                className="imgUploader"
              />
              <img
                src={`${imgsrc}${this.state.carousel_imgs_temp[3]}`}
                className="imgUploader"
              />
            </div>
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
            <div className="PrimTag">
              <div className="Tag">
                <p className="titleEaSetti">TAG 1 :</p>
                <input
                  placeholder="Tag of Carousel Page"
                  onChange={(e) => this.inputChangeHandler(e, "tagsCaro", 0)}
                  value={this.state.tagsCaro[0]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TAG 2 :</p>
                <input
                  placeholder="Tag of Carousel Page"
                  onChange={(e) => this.inputChangeHandler(e, "tagsCaro", 1)}
                  value={this.state.tagsCaro[1]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TAG 3 :</p>
                <input
                  placeholder="Tag of Carousel Page"
                  onChange={(e) => this.inputChangeHandler(e, "tagsCaro", 2)}
                  value={this.state.tagsCaro[2]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TAG 4 :</p>
                <input
                  placeholder="Tag of Carousel Page"
                  onChange={(e) => this.inputChangeHandler(e, "tagsCaro", 3)}
                  value={this.state.tagsCaro[3]}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="imgUploaderTitle">Tag Settings</p>
            <div className="PrimTag">
              <div className="Tag">
                <p className="titleEaSetti">TITLE 1 :</p>
                <input
                  placeholder="Title on Tags Page"
                  onChange={(e) => this.inputChangeHandler(e, "titles", 0)}
                  value={this.state.titles[0]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TITLE 2 :</p>
                <input
                  placeholder="Title on Tags Page"
                  onChange={(e) => this.inputChangeHandler(e, "titles", 1)}
                  value={this.state.titles[1]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TITLE 3 :</p>
                <input
                  placeholder="Title on Tags Page"
                  onChange={(e) => this.inputChangeHandler(e, "titles", 2)}
                  value={this.state.titles[2]}
                />
              </div>
              <div className="Tag">
                <p className="titleEaSetti">TITLE 4 :</p>
                <input
                  placeholder="Title on Tags Page"
                  onChange={(e) => this.inputChangeHandler(e, "titles", 3)}
                  value={this.state.titles[3]}
                />
              </div>
            </div>
            <div className="imgUploaderGroup">
              <img
                src={`${imgsrc}${this.state.tag_imgs_temp[0]}`}
                className="imgUploader"
              />
              <img
                src={`${imgsrc}${this.state.tag_imgs_temp[1]}`}
                className="imgUploader"
              />
              <img
                src={`${imgsrc}${this.state.tag_imgs_temp[2]}`}
                className="imgUploader"
              />
              <img
                src={`${imgsrc}${this.state.tag_imgs_temp[3]}`}
                className="imgUploader"
              />
            </div>
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
          <div className="PrimTag">
            <div className="Tag">
              <p className="titleEaSetti">TITLE 1 :</p>
              <input
                placeholder="Tags Page"
                onChange={(e) => this.inputChangeHandler(e, "tags", 0)}
                value={this.state.tags[0]}
              />
            </div>
            <div className="Tag">
              <p className="titleEaSetti">TITLE 2 :</p>
              <input
                placeholder="Tags Page"
                onChange={(e) => this.inputChangeHandler(e, "tags", 1)}
                value={this.state.tags[1]}
              />
            </div>
            <div className="Tag">
              <p className="titleEaSetti">TITLE 3 :</p>
              <input
                placeholder="Tags Page"
                onChange={(e) => this.inputChangeHandler(e, "tags", 2)}
                value={this.state.tags[2]}
              />
            </div>
            <div className="Tag">
              <p className="titleEaSetti">TITLE 4 :</p>
              <input
                placeholder="Tags Page"
                onChange={(e) => this.inputChangeHandler(e, "tags", 3)}
                value={this.state.tags[3]}
              />
            </div>
          </div>
          <p className="imgUploaderTitle">Footer Settings</p>
          <div className="Description">
            <p className="titleEaSetti">Contact Text :</p>
            <textarea
              className="DescTx"
              placeholder="Footer Contact Text"
              onChange={(e) => this.inputChangeHandler(e, "contact")}
              value={this.state.contact}
            />
          </div>
          <div className="Description">
            <p className="titleEaSetti">About Text :</p>
            <textarea
              className="DescTx"
              placeholder="Footer About Text"
              onChange={(e) => this.inputChangeHandler(e, "about")}
              value={this.state.about}
            />
          </div>
          <div className="Description">
            <p className="titleEaSetti">Help Text :</p>
            <textarea
              className="DescTx"
              placeholder="Footer Help Text"
              onChange={(e) => this.inputChangeHandler(e, "help")}
              value={this.state.help}
            />
          </div>
          <div className="submitBtnDiv">
            <button className="submitBtn normalBtn" onClick={this.submitItem}>
              Submit
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ManagerMain);
