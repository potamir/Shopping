/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { Link } from "react-router";
import AddItemPage from "../AddItemPage/index";
import CurrencyFormat from "react-currency-format";
import { browserHistory } from "react-router";
import "./styles.sass";

class ItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpened: false
    };
    this.openModal = this.openModal.bind(this);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    document.querySelector(".menu").classList.remove("open");
  }
  closeModal() {
    this.setState({ modalOpened: false });
    document.body.classList.remove("modal-opened");
    document.body.style.marginRight = 0;
  }

  getModal() {
    if (this.state.modalOpened) {
      return (
        <AddItemPage
          openClass="open"
          close={this.closeModal.bind(this)}
          item={this.props.location.state.item}
        />
      );
    } else {
      return;
    }
  }

  async openModal() {
    const loggedIn = await JSON.parse(localStorage.getItem("userData"));
    if (!loggedIn)
      browserHistory.push({
        pathname: `/login`
      });
    const scrollBar = document.querySelector(".scrollbar-measure");
    const scrollBarWidth = scrollBar.offsetWidth - scrollBar.clientWidth;
    document.body.classList.add("modal-opened");
    document.body.style.marginRight = `${scrollBarWidth}px`;
    this.setState({ modalOpened: true });
  }

  render() {
    let _path = "";
    const passedData = this.props.location.state;
    if (passedData._from === "tags") _path = "TagsItemPage";
    return (
      <div className="itemPageWrapper" ref={ref => (this.itemPageRef = ref)}>
        {this.getModal()}
        <div className="itemImgWrapper">
          <img src={null} className="itemImg" />
        </div>
        <div className="itemInfoWrapper">
          <Link
            className="backLink"
            to={{
              pathname: `/${_path}`,
              query: { param: true, component: "itempage" }
            }}
          >
            <span className="small">
              <svg
                fill="#000000"
                height="13"
                viewBox="0 0 18 15"
                width="13"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 10l5 5 5-5z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </span>
            All Items
          </Link>
          <h3 className="itemName">{passedData.item.name}</h3>
          <CurrencyFormat
            value={passedData.item.price}
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            prefix={"Rp."}
            suffix={",-"}
            renderText={value => <p className="itemCost frm">{value}</p>}
          />
          <p className="description">{passedData.item.description}</p>
          <button
            className="reqTradeBtn normalBtn"
            onClick={() => {
              this.openModal();
            }}
          >
            Add item
          </button>
        </div>
      </div>
    );
  }
}

export default ItemPage;
