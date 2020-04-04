/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import CurrencyFormat from "react-currency-format";
import { withRouter } from "react-router-dom";
import Pagination from "react-js-pagination";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import "./styles.sass";
import * as constant from "../constant.js";
const totalInOnePage = 10;

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const address = constant.ENDPOINT;
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], data: [], currPage: 1, totalItems: 0 };
    this.removeHandler = this.removeHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  async componentDidMount() {
    const loggedIn = await JSON.parse(localStorage.getItem("userData"));
    if (!loggedIn)
      this.props.history.push({
        pathname: `/login`
      });
    await this.setItems();
    await this.getItem();
    await this.getProv();
  }

  async getItem() {
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
        this.setState({ data: responseJson, totalItems: responseJson.length });
      });
  }

  async getProv() {
    await fetch(`http://${address}/shp_get_all`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(async responseJson => {
        if (responseJson.status)
          console.log("res", responseJson.data.rajaongkir.results);
      });
  }

  async setItems() {
    let tempItems = await { ...localStorage };
    await this.setState({
      items: Object.entries(tempItems)
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
      currPage: pageNumber
    });
    this.getItem((pageNumber - 1) * totalInOnePage);
  }
  render() {
    const classes = useStyles();
    console.log(this.state.data);
    return (
      <div className="cart">
        <div className="itemEaWrapper">
          {this.state.data.map((value, index) => {
            const total = value.price * parseInt(value.onCart);
            return (
              <div key={index} className="itemEa">
                <div className="leftDesc">
                  <div className="cImgDiv">
                    <img src={value.img} className="cartIcon" />
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
                        renderText={curr_value => (
                          <p className="itemsOnCartDet">{curr_value}</p>
                        )}
                      />
                      <CurrencyFormat
                        value={total}
                        displayType={"text"}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={"Total: Rp."}
                        suffix={",-"}
                        renderText={curr_value => (
                          <p className="itemsOnCartDet">{curr_value}</p>
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
        </div>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
          <Select defaultValue="" id="grouped-select">
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <ListSubheader>Category 1</ListSubheader>
            <MenuItem value={1}>Option 1</MenuItem>
            <MenuItem value={2}>Option 2</MenuItem>
            <ListSubheader>Category 2</ListSubheader>
            <MenuItem value={3}>Option 3</MenuItem>
            <MenuItem value={4}>Option 4</MenuItem>
          </Select>
        </FormControl>
        <div className="paginationContainer">
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
        <div className="pyBtnDiv">
          <button className="declineBtn normalBtn">Continue Payment</button>
        </div>
      </div>
    );
  }
}

export default withRouter(Cart);
