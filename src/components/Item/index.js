/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
// import {Link} from 'react-router';
import { withRouter } from "react-router-dom";
import "./styles.sass";
import * as constant from "../constant.js";

const imgsrc = constant.IMGSRC;

class Item extends Component {
  render() {
    return (
      <div className="item">
        <img
          src={`${imgsrc}${this.props.data.tag_img}`}
          className="contentItem"
          onClick={() => {
            this.props.history.push({
              pathname: "/TagsItemPage",
              state: {
                tag: this.props.data.tag_text,
                title: `title${this.props.index + 1}_tag`,
              },
            });
          }}
        />
      </div>
    );
  }
}

export default withRouter(Item);
