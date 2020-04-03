/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import CurrencyFormat from "react-currency-format";
import { withRouter } from "react-router-dom";

import "./styles.sass";
import * as constant from "../constant.js";

const address = constant.ENDPOINT;
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], data: [] };
    this.removeHandler = this.removeHandler.bind(this);
  }
  async componentDidMount() {
    const loggedIn = await JSON.parse(localStorage.getItem("userData"));
    if (!loggedIn)
      this.props.history.push({
        pathname: `/login`
      });
    await this.setItems();
    this.getItem();
  }

  async getItem() {
    console.log("aweae", this.state.items);
    // const data = this.state;
    await fetch(`http://${address}/items_get_id`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: this.state.items
      })
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log("res", responseJson);
        this.setState({ data: responseJson });
      });
  }

  async setItems() {
    let tempItems = await { ...localStorage };
    await this.setState({ items: Object.entries(tempItems) });
  }

  async removeHandler(val) {
    await localStorage.removeItem(`item_${val.item_id}`);
    await this.setItems();
    this.getItem();
  }
  render() {
    console.log(this.state.data);
    return (
      <div className="cart">
        {this.state.data.map((value, index) => {
          return (
            <div key={index} className="itemEa">
              <div className="leftDesc">
                <div className="cImgDiv">
                  <img src={value.img} className="cartIcon" />
                </div>
                <div>
                  <h3>{value.name}</h3>
                  <p>
                    {value.onCart} Item{value.onCart > 1 ? "s" : null}
                  </p>
                  <CurrencyFormat
                    value={value.price}
                    displayType={"text"}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={"Rp."}
                    suffix={",-"}
                    renderText={curr_value => <p>{curr_value}</p>}
                  />
                </div>
              </div>
              <div className="buttonDiv">
                <button
                  className="acceptBtn normalBtn"
                  onClick={() => this.removeHandler(value)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
        <div className="pyBtnDiv">
          <button className="declineBtn normalBtn">Continue Payment</button>
        </div>
      </div>
    );
  }
}

export default withRouter(Cart);
