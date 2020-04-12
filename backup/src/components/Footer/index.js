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
    const r = /\W+(?=[A-Z][a-z])/g,
      s = this.state.data.contact_text;
    let t = s ? s.replace(r, "\n") : "none";
    t = t.split("\n");
    return (
      <footer className="footer">
        <div className="footerChildDiv">
          <h3 className="footerTitle">Contact</h3>
          {t.map((value, index) => {
            return (
              <p key={index} className="footerContent">
                {value}
              </p>
            );
          })}
        </div>
        <div className="footerChildDiv">
          <h3 className="footerTitle">About Us</h3>
          <p className="footerContent">
            {this.state.data ? this.state.data.about_text : "none"}
          </p>
        </div>
        <div className="footerChildDiv">
          <h3 className="footerTitle">Help</h3>
          <p className="footerContent">
            {this.state.data ? this.state.data.help_text : "none"}
          </p>
        </div>
      </footer>
    );
  }
}

export default Footer;
