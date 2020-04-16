/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import ScaleLoader from "react-spinners/ScaleLoader";
import disableScroll from "disable-scroll";

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
            <ScaleLoader
              color={"#ffb4a2"}
              height={100}
              width={10}
              margin={10}
              radius={10}
              loading={_props.display}
            />
            <p className={"LoadingFont"}>Loading</p>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Loading;
