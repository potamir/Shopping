/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import BarLoader from "react-spinners/BarLoader";
import disableScroll from "disable-scroll";
import { css } from "@emotion/core";

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const _props = this.props;
    disableScroll.off();
    if (_props.display) disableScroll.on();
    return (
      <React.Fragment>
        {_props.display ? (
          <div className="LoadingWrapper">
            <BarLoader
              css={override}
              color={"#ffb4a2"}
              height={50}
              width={600}
              loading={_props.display}
            />
            <p className={"LoadingFont"}>Loading</p>
          </div>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}

const override = css`
  display: block;
  margin: 0 auto;
  background-color: #ddd;
`;

export default Loading;
