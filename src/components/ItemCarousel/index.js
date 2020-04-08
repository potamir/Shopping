/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./styles.sass";
import * as constant from "../constant.js";

const imgsrc = constant.IMGSRC;
let mq = window.matchMedia("(max-width: 768px)");

class ItemCarousel extends Component {
  constructor(props) {
    super(props);
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
  }

  componentDidMount() {
    mq.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mq.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged() {
    this.forceUpdate();
  }

  render() {
    const _props = this.props;
    return (
      <Carousel
        heigth={"200px"}
        infiniteLoop
        autoPlay
        showThumbs={false}
        interval={5000}
        className="caro"
      >
        {_props.data.map((value, index) => {
          return (
            <div key={index} className={"img_div"}>
              <img
                className={"item_caro"}
                src={`${imgsrc}${value.carousel_img}`}
              />
              {/*<p className="legend">{value.carousel_text}</p> */}
            </div>
          );
        })}
      </Carousel>
    );
  }
}

export default ItemCarousel;
