/* eslint-disable import/no-unresolved */
import React, { Component, PropTypes } from "react";
import CurrencyFormat from "react-currency-format";
import { withRouter } from "react-router-dom";
import "./styles.sass";

class AddItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = { total: 0 };
    this.close = this.close.bind(this);
  }

  async componentDidMount() {
    const currSelected_temp = await localStorage.getItem(
      `item_${this.props.item.item_id}`
    );
    let currSelected = JSON.parse(currSelected_temp);
    if (currSelected) this.setState({ total: parseInt(currSelected.total) });
    setTimeout(() => {
      this.modalWrapper.classList.add(this.props.openClass);
    }, 50);
  }

  async close() {
    const data = {
      total: this.state.total,
      id: this.props.item.item_id
    };
    await localStorage.setItem(
      `item_${this.props.item.item_id}`,
      JSON.stringify(data)
    );
    if (this.state.total < 1)
      localStorage.removeItem(`item_${this.props.item.item_id}`);
    this.modalWrapper.classList.remove(this.props.openClass);
    setTimeout(() => {
      this.props.close();
    }, 850);
  }

  calculate(param) {
    if (param === "dec" && this.state.total > 0)
      this.setState({ total: this.state.total - 1 });
    else if (param === "inc") this.setState({ total: this.state.total + 1 });
  }

  render() {
    const _props = this.props;
    return (
      <div
        className="addItemWrapper"
        ref={node => {
          this.modalWrapper = node;
        }}
      >
        <div className="hider" />
        <div className="modal">
          <div className="heading">
            <h3>Add Item</h3>
          </div>
          <div className="itemWrapper">
            <div className="itemPicWrapper">
              <div className="img">
                <img src={_props.item.img} className="addImage" />
              </div>
            </div>
            <div className="itemInfoWrapper">
              <div className="inputWrapper">
                <label htmlFor="itemName">Price:</label>
                <CurrencyFormat
                  value={_props.item.price}
                  displayType={"text"}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix={"Rp."}
                  suffix={",-"}
                  renderText={value => <p>{value}</p>}
                />
              </div>
              <div className="priceWrapper">
                <div className="inputWrapper">
                  <label htmlFor="itemPrice">Quantity</label>
                  <div className="itemPriceInnerDiv">
                    <p onClick={() => this.calculate("dec")} className="incDec">
                      {"-"}
                    </p>
                    <input
                      id="itemPrice"
                      name="itemPrice"
                      type="number"
                      className="itemPrice"
                      readOnly
                      required
                      value={this.state.total}
                    />
                    <p onClick={() => this.calculate("inc")} className="incDec">
                      {"+"}
                    </p>
                  </div>
                </div>
                <div className="inputWrapper">
                  <label htmlFor="itemCurrency">Current Stocks</label>
                  <input
                    id="itemCurrency"
                    name="itemCurrency"
                    type="text"
                    className="itemPrice"
                    value={_props.item.total}
                    readOnly
                  />
                </div>
              </div>
              <div className="inputWrapper">
                <label htmlFor="itemDescription">Description:</label>
                <textarea
                  name="itemDescription"
                  id="itemDescription"
                  className="itemDescription"
                  placeholder="Additional Description (Optional)"
                />
              </div>
            </div>
          </div>
          <div className="buttonWrapper">
            <button
              className="saveItemBtn"
              onClick={async () => {
                await this.close();
                this.props.history.push({
                  pathname: `/cart`
                });
              }}
            >
              Pay My Item(s)
            </button>
            <button
              className="cancelItemBtn"
              onClick={async () => {
                this.close();
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
}

AddItemPage.propTypes = {
  close: PropTypes.func,
  openClass: PropTypes.string
};

export default withRouter(AddItemPage);
