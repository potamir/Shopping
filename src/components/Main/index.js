/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";
import Item from "../Item/index";
import ItemNew from "../ItemNew/index";
import ItemCarousel from "../ItemCarousel/index";
import { withRouter } from "react-router-dom";
import * as constant from "../constant.js";

const address = constant.ENDPOINT;
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      data: [],
      tagsData: []
    };
  }
  async componentDidMount() {
    console.log(localStorage);
    const status = this.props.location.state;
    this.props.history.push({ pathname: "/", state: "loggedin" });
    if (status === "login") window.location.reload();
    // const loggedIn = await JSON.parse(localStorage.getItem("userData"));
    // if (!loggedIn)
    //   browserHistory.push({
    //     pathname: `/login`
    //   });
    let newRefPos = this.itemNewRef.offsetTop;
    if (
      this.props.location.query
        ? this.props.location.query.component === "tags"
        : false
    )
      newRefPos = this.itemTagsRef.offsetTop;
    if (this.props.location.query ? this.props.location.query.param : false)
      window.scrollTo(0, newRefPos);
    document.querySelector(".menu").classList.remove("open");
    await this.getMainman();
    this.getItem();
  }

  async getItem() {
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
        renderFrom: 0,
        renderUntil: 8
      })
    })
      .then(response => response.json())
      .then(async responseJson => {
        await this.setState({
          items: responseJson
        });
      });
  }

  async getMainman() {
    fetch(`http://${address}/mainman_get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(async responseJson => {
        const tempData = [];
        const tempTagsData = [];
        for (let i = 0; i < 4; i++) {
          const currCar = `carousel_img${i + 1}`;
          const currCarTxt = `carousel_text${i + 1}`;
          const currTag = `tag${i + 1}_img`;
          const currTagTxt = `tag${i + 1}_text`;
          if (responseJson[0][currCar].length > 0)
            tempData.push({
              carousel_img: responseJson[0][currCar],
              carousel_text: responseJson[0][currCarTxt]
            });
          tempTagsData.push({
            tag_img: responseJson[0][currTag],
            tag_text: responseJson[0][currTagTxt]
          });
        }
        await this.setState({
          data: tempData,
          tagsData: tempTagsData
        });
      });
  }

  render() {
    return (
      <div className="main">
        <ItemCarousel data={this.state.data} />
        <div className="innerMain">
          <div className="itemDiv" ref={ref => (this.itemTagsRef = ref)}>
            {this.state.tagsData.map((e, i) => (
              <Item key={i} data={e} />
            ))}
          </div>
          <h1 className="itemMainTitle" ref={ref => (this.itemNewRef = ref)}>
            Newest Collection
          </h1>
          <div className="itemNewDiv">
            {this.state.items.map((e, i) => (
              <ItemNew key={i} index={i} items={e} from={"main"} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Homepage);
