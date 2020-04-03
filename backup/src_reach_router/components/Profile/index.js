/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import BasicInfo from "../BasicInfo/index";
import OtherInfo from "../OtherInfo/index";
import "./styles.sass";

class Profile extends Component {
  async componentDidMount() {
    // const loggedIn = await JSON.parse(localStorage.getItem("userData"));
    // if (!loggedIn)
    //   browserHistory.push({
    //     pathname: `/login`
    //   });
    document.body.scrollTop = 0;
    document.querySelector(".menu").classList.remove("open");
  }
  render() {
    return (
      <div className="infoWrapper">
        <BasicInfo />
        <OtherInfo />
      </div>
    );
  }
}

export default Profile;
