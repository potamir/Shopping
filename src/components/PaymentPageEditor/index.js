/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import * as constant from "../constant.js";
import Loading from "../Loading/index";

const address = constant.ENDPOINT;
class PaymentPageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      loading: false,
    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.submitHtml = this.submitHtml.bind(this);
    this.getPaymentPage = this.getPaymentPage.bind(this);
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
    this.getPaymentPage();
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  }

  async getPaymentPage() {
    await this.setState({ loading: true });
    await fetch(`http://${address}/py_page_get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        const blocksFromHtml = htmlToDraft(responseJson[0].py_page_content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const editorState = EditorState.createWithContent(contentState);
        this.onEditorStateChange(editorState);
        this.setState({ loading: false });
      });
  }

  async uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.imgur.com/3/image");
      xhr.setRequestHeader("Authorization", "Client-ID 25153815073b152");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  }
  async submitHtml() {
    await this.setState({ loading: true });
    const _state = this.state;
    await fetch(`http://${address}/py_page_post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pyContent: draftToHtml(
          convertToRaw(_state.editorState.getCurrentContent())
        ),
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.status === "success")
          this.setState({ loading: false });
        else console.log(status);
      });
  }

  render() {
    return (
      <React.Fragment>
        <Loading display={this.state.loading} />
        <div className="PaymentMain">
          <h3 className="PaymentTitle">{"Payment Description Editor"}</h3>
          <div className="OriginPaymentDesc">
            <Editor
              editorState={this.state.editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName additionalEditor"
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{
                image: {
                  uploadCallback: this.uploadImageCallBack,
                  alt: { present: true, mandatory: false },
                },
              }}
            />
          </div>
          <div className="pyPageBtnDiv">
            <button onClick={this.submitHtml} className="declineBtn normalBtn">
              Submit Changes
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(PaymentPageEditor);
