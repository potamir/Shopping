/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import Modal from "react-modal";
import ImageUploader from "react-images-upload";
import ModalImage from "react-modal-image";
import * as constant from "../constant.js";

const fileSize = 10242880;
const imgsrc = constant.IMGSRC;

class Popup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const _props = this.props;
    return (
      <div>
        <Modal
          isOpen={_props.modalIsOpen}
          onRequestClose={_props.closeModal}
          style={customStyles}
        >
          <p className="modalTxt">{_props.modalMsg}</p>
          {_props.buttonType === "choice" ? (
            <form>
              <input readOnly className="modalInp" />
              <div className="modalButton">
                <button
                  type="button"
                  className="modalBtn yesBtn"
                  onClick={_props.yesCommand}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="modalBtn cclBtn"
                  onClick={_props.closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
          {_props.buttonType === "close" ? (
            <form>
              <input readOnly className="modalInp" />
              <div className="modalButton">
                <button
                  type="button"
                  className="modalBtn cclBtn"
                  onClick={_props.closeModal}
                >
                  Close
                </button>
              </div>
            </form>
          ) : null}
          {_props.buttonType === "imgsbm" ? (
            <form>
              <ImageUploader
                className="imgUploaderPop"
                withIcon={false}
                buttonText="+"
                withPreview={_props.preview}
                onChange={(e, u) => _props.onDrop(e, u, 0)}
                imgExtension={[".jpg", ".png", ".PNG", ".jpeg"]}
                maxFileSize={fileSize}
                withLabel={false}
                singleImage={true}
              />
              <input readOnly className="modalInp" />
              <div className="modalButton">
                <button
                  type="button"
                  className="modalBtn yesBtn"
                  onClick={_props.yesCommand}
                >
                  Send
                </button>
                <button
                  type="button"
                  className="modalBtn cclBtn"
                  onClick={_props.closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
          {_props.buttonType === "imgdis" ? (
            <form>
              <ModalImage
                small={`${imgsrc}${_props.image}`}
                large={`${imgsrc}${_props.image}`}
                showRotate={true}
              />
              <input readOnly className="modalInp" />
              <div className="modalButton">
                <button
                  type="button"
                  className="modalBtn cclBtn"
                  onClick={_props.closeModal}
                >
                  Close
                </button>
              </div>
            </form>
          ) : null}
        </Modal>
      </div>
    );
  }
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    userSelect: "none",
  },
};

export default Popup;
