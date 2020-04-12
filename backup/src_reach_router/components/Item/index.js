/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
// import {Link} from 'react-router';
import { browserHistory } from "react-router";

import "./styles.sass";

class Item extends Component {
  render() {
    console.log(this.props.data);
    return (
      <div className="item">
        <img
          src={this.props.data.tag_img}
          className="contentItem"
          onClick={() => {
            browserHistory.push("/TagsItemPage");
          }}
        />
      </div>
    );
  }
}

export default Item;
