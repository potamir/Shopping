/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import "./styles.sass";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }
  componentDidMount() {
    let item = "";
    try {
      item = JSON.parse(localStorage.getItem("mainman"));
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ data: item });
    }
  }
  render() {
    return (
      <footer className="footer">
        <div className="footerChildDiv">
          <h3 className="footerTitle">Contact</h3>
          {this.state.data.contact_text.split(";").map((value, index) => {
            return (
              <p key={index} className="footerContent">
                {value}
              </p>
            );
          })}
        </div>
        <div className="footerChildDiv">
          <h3 className="footerTitle">About Us</h3>
          {this.state.data.about_text.split(";").map((value, index) => {
            return (
              <p key={index} className="footerContent">
                {value}
              </p>
            );
          })}
        </div>
        <div className="footerChildDiv">
          <h3 className="footerTitle">Help</h3>
          {this.state.data.help_text.split(";").map((value, index) => {
            return (
              <p key={index} className="footerContent">
                {value}
              </p>
            );
          })}
        </div>
      </footer>
    );
  }
}

export default Footer;
