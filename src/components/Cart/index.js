/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import CurrencyFormat from "react-currency-format";
import { withRouter } from "react-router-dom";
import Pagination from "react-js-pagination";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { styled } from "@material-ui/core/styles";
import Loading from "../Loading/index";

import "./styles.sass";
import * as constant from "../constant.js";
const totalInOnePage = 10;

const StyledFormControl = styled(FormControl)({
  margin: 5,
  minWidth: 400,
});

const address = constant.ENDPOINT;
const imgsrc = constant.IMGSRC;
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      data: [],
      currPage: 1,
      totalItems: 0,
      provs: [],
      cities: [],
      selectedProv: "",
      selectedCity: "",
      selectedType: "REG",
      shippingCost: [],
      finalShipCost: 0,
      loading: false,
      completeAdd: [],
    };
    this.removeHandler = this.removeHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.dropdownHandler = this.dropdownHandler.bind(this);
    this.calcCost = this.calcCost.bind(this);
    this.setFinalShipCost = this.setFinalShipCost.bind(this);
    this.insertPayment = this.insertPayment.bind(this);
    this.deleteItemsOnCart = this.deleteItemsOnCart.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }
  async componentDidMount() {
    const loggedIn = await JSON.parse(localStorage.getItem("userData"));
    if (!loggedIn)
      this.props.history.push({
        pathname: `/login`,
      });
    await this.setItems();
    await this.getItem();
    await this.getProv();
  }

  async getItem() {
    await this.setState({ loading: true });
    // const data = this.state;
    await fetch(`http://${address}/items_get_id`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: this.state.items,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({
          data: responseJson,
          totalItems: responseJson.length,
          loading: false,
        });
      });
  }

  async getProv() {
    await this.setState({ loading: true });
    await fetch(`http://${address}/shp_get_all`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.status)
          this.setState({
            provs: responseJson.provs.rajaongkir.results,
            cities: responseJson.cities.rajaongkir.results,
            loading: false,
          });
      });
  }

  async calcCost(totalWeight) {
    await this.setState({ loading: true });
    const _state = this.state;
    await fetch(`http://${address}/shp_cost`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dest: _state.selectedCity,
        weight: totalWeight,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.status) {
          await this.setState({
            shippingCost: responseJson.result.rajaongkir.results[0].costs,
          });
          this.setFinalShipCost();
        } else console.log(responseJson.result);
        this.setState({ loading: false });
      });
  }

  async insertPayment(total) {
    const _state = this.state;
    const _props = this.props;
    if (
      _state.data.length > 0 &&
      _state.selectedCity &&
      total > 0 &&
      _state.completeAdd[0].length > 0
    ) {
      const user = await JSON.parse(localStorage.getItem("userData"));
      await fetch(`http://${address}/payment_post`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.user_id,
          totalPayment: total,
          userOrigin: _state.selectedCity,
          paymentStatus: "Waiting Payment",
          itemsOnCart: JSON.stringify(_state.data),
          paymentType: _state.selectedType,
          addInfo: _state.completeAdd[0],
        }),
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          if (responseJson.status === "success") {
            await this.deleteItemsOnCart();
            _props.history.push({
              pathname: `/PaymentPage`,
              state: { total: total, status: true, path: "Cart" },
            });
          } else console.log("error");
        });
    } else console.log("not valid");
  }

  deleteItemsOnCart() {
    const data = this.state.data;
    for (let i = 0; i < data.length; i++) {
      const itemId = `item_${data[i].item_id}`;
      localStorage.removeItem(itemId);
    }
  }

  async setItems() {
    let tempItems = await { ...localStorage };
    await this.setState({
      items: Object.entries(tempItems),
    });
  }

  async removeHandler(val) {
    await localStorage.removeItem(`item_${val.item_id}`);
    await this.setItems();
    this.getItem();
  }
  async handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    await this.setState({
      currPage: pageNumber,
    });
    this.getItem((pageNumber - 1) * totalInOnePage);
  }

  dropdownHandler(_state, value) {
    this.setState({ [_state]: value });
  }

  setFinalShipCost() {
    let cost = this.state.shippingCost[0].cost[0].value;
    if (this.state.selectedType === "REG")
      cost = this.state.shippingCost[1].cost[0].value;
    this.setState({ finalShipCost: cost });
  }

  inputChangeHandler(e, _state) {
    let newValue = e.target.value;
    this.state[_state].splice(0, 1, newValue);
    this.forceUpdate();
  }

  render() {
    let allTotal = 0;
    let allWeigth = 0;
    return (
      <div className="cart">
        <Loading display={this.state.loading} />
        <div className="itemEaWrapper">
          {this.state.data.map((value, index) => {
            const total = value.price * parseInt(value.onCart);
            return (
              <div key={index} className="itemEa">
                <div className="leftDesc">
                  <div className="cImgDiv">
                    <img src={`${imgsrc}${value.img}`} className="cartIcon" />
                  </div>
                  <div className="itemEaOnCart">
                    <div>
                      <h3>{value.name}</h3>
                    </div>
                    <div className="itemsOnCart">
                      <p className="itemsOnCartDet">
                        {value.onCart} Item{value.onCart > 1 ? "s" : null}
                      </p>
                      <CurrencyFormat
                        value={value.price}
                        displayType={"text"}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"Price: Rp."}
                        suffix={",-"}
                        renderText={(curr_value) => (
                          <p className="itemsOnCartDetPrice">{curr_value}</p>
                        )}
                      />
                      <CurrencyFormat
                        value={total}
                        displayType={"text"}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"Total: Rp."}
                        suffix={",-"}
                        renderText={(curr_value) => (
                          <p className="itemsOnCartDetPrice">{curr_value}</p>
                        )}
                      />
                    </div>
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
          {this.state.data.length > 0 ? null : (
            <div className="emptyCartListDiv">
              <p className="emptyCartContent">*Empty Cart*</p>
            </div>
          )}
        </div>
        <div className="paginationContainer cartPaginationContainer">
          <Pagination
            hideDisabled
            innerClass={"pagination"}
            activeClass={"active"}
            activePage={this.state.currPage}
            itemsCountPerPage={totalInOnePage}
            totalItemsCount={this.state.totalItems}
            onChange={this.handlePageChange}
          />
        </div>
        <div className="totalContainer">
          <h3 className="totalTitle">Total Payment</h3>
          {this.state.data.map((value, index) => {
            const total = value.price * parseInt(value.onCart);
            const weight = value.weight * parseInt(value.onCart);
            allTotal += total;
            allWeigth += weight;
            return (
              <CurrencyFormat
                value={total}
                key={index}
                displayType={"text"}
                thousandSeparator="."
                decimalSeparator=","
                prefix={""}
                suffix={",-"}
                renderText={(total) => (
                  <div className="totalFormatCon">
                    <p className="totalNamFormat">{value.name}</p>
                    <p className="totalCurFormat">Rp.</p>
                    <p className="totalValFormat">{total}</p>
                  </div>
                )}
              />
            );
          })}
          <CurrencyFormat
            value={this.state.finalShipCost}
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            prefix={""}
            suffix={",-"}
            renderText={(total) => (
              <div className="totalFormatCon">
                <p className="totalNamFormat">{"Shipping Cost"}</p>
                <p className="totalCurFormat">Rp.</p>
                <p className="totalDesFormat">
                  {total === "0,-" ? "Fill Destination!" : total}
                </p>
              </div>
            )}
          />
          <div className="additionTemp"></div>
          <CurrencyFormat
            value={allTotal + this.state.finalShipCost}
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            prefix={""}
            suffix={",-"}
            renderText={(total) => (
              <div className="totalFormatCon">
                <p className="totalTotFormat">{"TOTAL"}</p>
                <p className="totalCurFormat">Rp.</p>
                <p className="totalValFormat">{total}</p>
              </div>
            )}
          />
        </div>
        <div className="dropdownLocation">
          <StyledFormControl>
            <InputLabel htmlFor="grouped-select">Province</InputLabel>
            <Select
              onChange={async (e) => {
                await this.dropdownHandler(
                  "selectedProv",
                  e.target.value.province_id
                );
                this.setState({ selectedCity: "" });
              }}
              defaultValue=""
              id="grouped-select"
            >
              {this.state.provs.map((value, index) => {
                return (
                  <MenuItem key={index} value={value}>
                    {value.province}
                  </MenuItem>
                );
              })}
            </Select>
          </StyledFormControl>
          {this.state.selectedProv.length > 0 ? (
            <StyledFormControl>
              <InputLabel htmlFor="grouped-select">City</InputLabel>
              <Select
                onChange={async (e) => {
                  await this.dropdownHandler(
                    "selectedCity",
                    e.target.value.city_id
                  );
                  this.calcCost(allWeigth);
                }}
                defaultValue=""
                id="grouped-select"
              >
                {this.state.cities.map((value, index) => {
                  if (value.province_id === this.state.selectedProv) {
                    return (
                      <MenuItem key={index} value={value}>
                        {value.type} {value.city_name}
                      </MenuItem>
                    );
                  } else return null;
                })}
              </Select>
            </StyledFormControl>
          ) : null}
          {this.state.shippingCost.length > 0 ? (
            <React.Fragment>
              <StyledFormControl>
                <InputLabel htmlFor="grouped-select">Type</InputLabel>
                <Select
                  onChange={async (e) => {
                    await this.dropdownHandler("selectedType", e.target.value);
                    this.setFinalShipCost();
                  }}
                  defaultValue={"REG"}
                  id="grouped-select"
                >
                  <MenuItem value={"OKE"}>Ongkos Kirim Ekonomis</MenuItem>
                  <MenuItem value={"REG"}>Layanan Reguler</MenuItem>
                </Select>
              </StyledFormControl>
              <div className="detailInfo">
                <p className="detailInfoTitle">DETAIL ADDRESS</p>
                <textarea
                  placeholder="Complete address such as: District, Housing, Block, Additional Phone Number, etc."
                  onChange={(e) => this.inputChangeHandler(e, "completeAdd")}
                  value={this.state.completeAdd}
                  className="detailInfoTextArea"
                />
              </div>
            </React.Fragment>
          ) : null}
        </div>
        <div className="pyBtnDiv">
          <button
            className="continuePaymentBtn normalBtn"
            onClick={() =>
              this.insertPayment(allTotal + this.state.finalShipCost)
            }
          >
            Continue Payment
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Cart);
