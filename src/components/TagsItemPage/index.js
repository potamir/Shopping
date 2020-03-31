/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import { Link } from "react-router";
import ItemNew from "../ItemNew/index";
import Pagination from "react-js-pagination";
// import "bootstrap/dist/css/bootstrap.min.css";
import * as constant from "../constant.js";

const address = constant.ENDPOINT;
const totalInOnePage = 8;

class TagsItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currPage: 1,
      totalItems: 0
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.querySelector(".menu").classList.remove("open");
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
          items: responseJson,
          totalItems: responseJson[0].TotalRows
        });
      });
  }
  async handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    await this.setState({
      currPage: pageNumber
    });
    this.getItem((pageNumber - 1) * totalInOnePage);
  }
  render() {
    return (
      <div className="main">
        <Link
          className="backLink"
          to={{ pathname: "/", query: { param: true, component: "tags" } }}
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
          Back
        </Link>
        <div className="itemTagsMainDiv">
          <h1 className="itemTagsMainTitle">Items #A #B</h1>
          <div className="itemNewDiv" ref={ref => (this.itemNewRef = ref)}>
            {this.state.items.map((e, i) => (
              <ItemNew key={i} index={i} items={e} from={"tags"} />
            ))}
          </div>
        </div>
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

export default TagsItemPage;
