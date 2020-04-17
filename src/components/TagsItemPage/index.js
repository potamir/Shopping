/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import ItemNew from "../ItemNew/index";
import Pagination from "react-js-pagination";
// import "bootstrap/dist/css/bootstrap.min.css";
import * as constant from "../constant.js";
import { withRouter, Link } from "react-router-dom";
import Loading from "../Loading/index";

const address = constant.ENDPOINT;
const totalInOnePage = 8;

class TagsItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currPage: 1,
      totalItems: 0,
      loading: false,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.getItemAll = this.getItemAll.bind(this);
  }

  async componentDidMount() {
    const _props = this.props;
    if (!_props.location.state) _props.history.push("/");
    else {
      window.scrollTo(0, 0);
      document.querySelector(".menu").classList.remove("open");
      if (_props.location.state.tag.toUpperCase() === "ALL")
        await this.getItemAll(0);
      else await this.getItem(0, _props.location.state.tag);
    }
    if (this.state.items.length < 1) this.setState({ loading: false });
  }

  async getItem(renderFrom, tag) {
    // const data = this.state;
    await this.setState({ loading: true });
    await fetch(`http://${address}/items_get_tag`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        renderFrom: renderFrom,
        renderUntil: totalInOnePage,
        tag: tag,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.length > 0) {
          await this.setState({
            items: responseJson,
            totalItems: responseJson[0].TotalRows,
            loading: false,
          });
        }
      });
  }

  async getItemAll(renderFrom) {
    // const data = this.state;
    await this.setState({ loading: true });
    await fetch(`http://${address}/items_get`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        renderFrom: renderFrom,
        renderUntil: totalInOnePage,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.length > 0) {
          await this.setState({
            items: responseJson,
            totalItems: responseJson[0].TotalRows,
            loading: false,
          });
        }
      });
  }

  async handlePageChange(pageNumber) {
    const _props = this.props;
    await this.setState({
      currPage: pageNumber,
    });
    if (_props.location.state.tag.toUpperCase() === "ALL")
      this.getItemAll((pageNumber - 1) * totalInOnePage);
    else
      this.getItem(
        (pageNumber - 1) * totalInOnePage,
        _props.location.state.tag
      );
  }
  render() {
    return (
      <div className="main">
        <Loading display={this.state.loading} />
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
          <h1 className="itemTagsMainTitle">
            {this.state.items.length > 0
              ? this.state.items[0][this.props.location.state.title]
              : "No Title Found"}
          </h1>
          <div className="itemNewDiv" ref={(ref) => (this.itemNewRef = ref)}>
            {this.state.items.length > 0 ? (
              <React.Fragment>
                {this.state.items.map((e, i) => (
                  <ItemNew
                    key={i}
                    index={i}
                    items={e}
                    from={"tags"}
                    tagText={this.props.location.state.tag}
                    tagIndex={this.props.index + 1}
                  />
                ))}
              </React.Fragment>
            ) : (
              <div>
                <h3>
                  There Is No Item With Tag: {this.props.location.state.tag}
                </h3>
              </div>
            )}
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

export default withRouter(TagsItemPage);
