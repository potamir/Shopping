/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import CurrencyFormat from "react-currency-format";
// import ImageUploader from "react-images-upload";
import Pagination from "react-js-pagination";
import Popup from "../Popup/index.js";
import * as constant from "../constant.js";
const address = constant.ENDPOINT;

const totalInOnePage = 10;

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      data: [],
      currPage: 1,
      totalItems: 0,
      modalIsOpen: false,
      modalMsg: "",
      selectedItem: ""
    };
    this.editItem = this.editItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteListedItem = this.deleteListedItem.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  async componentDidMount() {
    this.getItem(0);
  }

  async getItem(renderFrom) {
    // const data = this.state;
    await fetch(`http://${address}/items_get`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tag1: "",
        tag2: "",
        tag3: "",
        tag4: "",
        renderFrom: renderFrom,
        renderUntil: totalInOnePage
      })
    })
      .then(response => response.json())
      .then(async responseJson => {
        await this.setState({
          data: responseJson,
          totalItems: responseJson[0].TotalRows
        });
      });
  }

  async deleteItem() {
    // const data = this.state;
    await fetch(`http://${address}/items_upd`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        itemId: this.state.selectedItem
      })
    })
      .then(response => response.json())
      .then(async responseJson => {
        if (responseJson.status === "success") window.location.reload();
      });
  }

  async handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    await this.setState({
      currPage: pageNumber
    });
    this.getItem((pageNumber - 1) * totalInOnePage);
  }

  async editItem(val) {
    console.log(val);
    // browserHistory.push({
    //   pathname: `/Admin`,
    //   state: { item: val, status: "edit" }
    // });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  async deleteListedItem(val) {
    this.setState({
      selectedItem: val.item_id,
      modalIsOpen: true,
      modalMsg: `Are you sure want to delete ${val.name}?`
    });
  }
  render() {
    console.log(this.state.data);
    return (
      <div className="AdminMan">
        <Popup
          openModal={this.openModal}
          closeModal={this.closeModal}
          modalIsOpen={this.state.modalIsOpen}
          modalMsg={this.state.modalMsg}
          yesCommand={this.deleteItem}
          buttonType={"choice"}
        />
        {this.state.data.map((value, index) => {
          return (
            <div key={index} className="itemEa">
              <div className="leftDesc">
                <div className="cImgDiv">
                  <img src={value.img1} className="cartIcon" />
                </div>
                <div>
                  <h4>{value.name}</h4>
                  <p>
                    {value.total} Item{value.total > 1 ? "s" : null} Left
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
                  className="deleteBtn adminManBtn normalBtn"
                  onClick={() => this.deleteListedItem(value)}
                >
                  Delete
                </button>
                <button
                  className="editBtn adminManBtn normalBtn"
                  onClick={() => this.editItem(value)}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
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
      </div>
    );
  }
}

export default withRouter(Admin);
