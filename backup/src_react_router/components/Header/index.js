/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./styles.sass";

let mq = window.matchMedia("(max-width: 768px)");

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.logOut = this.logOut.bind(this);
    this.setNav = this.setNav.bind(this);
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
  }

  componentWillMount() {
    mq.addListener(this.mediaQueryChanged);
    this.previousWidth = 0;
    this.menuButton = (
      <button
        className="menuBtn"
        onClick={() => {
          document.querySelector(".menu").classList.toggle("open");
        }}
      >
        MENU
      </button>
    );

    this.loggedInMenu = (
      <div className="menu">
        <div className="innerMenu innerMenuDirection1">
          <NavLink
            to="/admin"
            activeClassName="activeNavLink"
            className="navLink"
          >
            New
          </NavLink>
          <NavLink
            to="/adminman"
            activeClassName="activeNavLink"
            className="navLink"
          >
            Update
          </NavLink>
          <NavLink
            to="/managermain"
            activeClassName="activeNavLink"
            className="navLink"
          >
            Main
          </NavLink>
          <NavLink
            to="/adpageman"
            activeClassName="activeNavLink"
            className="navLink"
          >
            Advertisement
          </NavLink>
          {mq.matches ? (
            <NavLink
              to="/cart"
              onClick={async () => {
                // const loggedIn = await JSON.parse(
                //   localStorage.getItem("userData")
                // );
              }}
              activeClassName="activeNavLink"
              className="navLink"
            >
              CART
            </NavLink>
          ) : null}
          {mq.matches ? (
            <NavLink
              to="/login"
              activeClassName="activeNavLink"
              className="navLink"
            >
              Log Out
            </NavLink>
          ) : null}
        </div>
        {!mq.matches ? (
          <div className="innerMenu innerMenuDirection2">
            <NavLink
              to="/cart"
              activeClassName="activeNavLink"
              className="cartMenu navLink"
            >
              CART
            </NavLink>
          </div>
        ) : null}
      </div>
    );

    this.setNav();
    this.setMenuState(window.innerWidth);
    this.previousWidth = window.innerWidth;
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setMenuState(window.innerWidth);
    });
  }
  componentWillUnmount() {
    mq.removeListener(this.mediaQueryChanged);
  }
  mediaQueryChanged() {
    this.forceUpdate();
  }

  checkLoginStatus() {
    // const loggedIn = JSON.parse(localStorage.getItem("userData"));
    // if (!loggedIn)
    //   browserHistory.push({
    //     pathname: `/login`
    //   });
  }

  setMenuState(width) {
    if (this.previousWidth !== width) {
      if (width > 768) {
        const menu = document.querySelector("div.menu");
        if (menu) {
          menu.classList.remove("open");
        }
        this.setState({ menuActive: false });
      } else {
        this.setState({ menuActive: true });
      }
      this.previousWidth = width;
    }
  }

  setNav() {
    // check for auth here
    this.setState({ nav: this.loggedInMenu });
  }

  logOut() {
    localStorage.removeItem("userData");
    // browserHistory.push({
    //   pathname: `/login`,
    //   state: "logout"
    // });
  }

  render() {
    return (
      <header className="header">
        <div className="headerExt">
          <NavLink to="/" activeClassName="activeNavLink" className="logo">
            COUTURE HIJAB
          </NavLink>
          {!mq.matches ? (
            <NavLink
              to="/login"
              onClick={this.logOut}
              activeClassName="activeNavLink"
              className="navLink login"
            >
              Login
            </NavLink>
          ) : null}
        </div>
        <div className={"header_logodiv"}>
          <img
            className={"header_logo"}
            src={require("../../assets/images/logo.png")}
          />
        </div>
        {this.state.menuActive ? this.menuButton : ""}
        {this.state.nav}
      </header>
    );
  }
}

export default Header;
