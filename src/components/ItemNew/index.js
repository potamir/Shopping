/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";
import CurrencyFormat from "react-currency-format";
import "./styles.sass";
import * as constant from "../constant.js";
const imgsrc = constant.IMGSRC;

class ItemNew extends Component {
  constructor(props) {
    super(props);
    this.state = { flipped: false, opacity: 1, timeOutx: null };
    this.opacityHandler = this.opacityHandler.bind(this);
  }

  opacityHandler(param) {
    this.setState({
      timeOutx: setTimeout(
        async function () {
          await this.setState({ flipped: param });
          this.setState({ opacity: 1 });
        }.bind(this),
        500
      ),
    });
  }
  render() {
    let flipped = "img1";
    if (this.state.flipped) flipped = "img2";
    const _props = this.props;
    const newItem = {
      item_id: _props.items.item_id,
      name: _props.items.name,
      price: _props.items.price,
      description: _props.items.description,
      img: _props.items.img1,
      total: _props.items.total,
      weight: _props.items.weight,
    };
    return (
      <div className="itemNew">
        <img
          style={{ opacity: this.state.opacity }}
          src={`${imgsrc}${_props.items[flipped]}`}
          className="contentNew"
          onClick={() => {
            this.props.history.push({
              pathname: `/item/${_props.index}`,
              state: { item: newItem, _from: _props.from },
            });
          }}
          onMouseOver={async () => {
            clearTimeout(this.state.timeOutx);
            await this.setState({ opacity: 0.2 });
            this.opacityHandler(true);
          }}
          onMouseOut={async () => {
            clearTimeout(this.state.timeOutx);
            await this.setState({ opacity: 0.2 });
            this.opacityHandler(false);
          }}
        />
        <h2 className="itemNewHeader">{_props.items.name}</h2>
        <CurrencyFormat
          value={_props.items.price}
          displayType={"text"}
          thousandSeparator="."
          decimalSeparator=","
          prefix={"Rp."}
          suffix={",-"}
          renderText={(value) => <div className="itemNewPrice">{value}</div>}
        />
      </div>
    );
  }
}

export default withRouter(ItemNew);
