/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { Link } from "react-router";
import { browserHistory } from "react-router";

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
          <Link
            onlyActiveOnIndex={true}
            key={1}
            to="/admin"
            activeClassName="activeNavLink"
            className="navLink"
          >
            New
          </Link>
          <Link
            onlyActiveOnIndex={true}
            key={2}
            to="/adminman"
            activeClassName="activeNavLink"
            className="navLink"
          >
            Update
          </Link>
          <Link
            onlyActiveOnIndex={true}
            key={3}
            to="/managermain"
            activeClassName="activeNavLink"
            className="navLink"
          >
            Main
          </Link>
          <Link
            onlyActiveOnIndex={true}
            key={4}
            to="/adpageman"
            activeClassName="activeNavLink"
            className="navLink"
          >
            Advertisement
          </Link>
          {mq.matches ? (
            <Link
              onlyActiveOnIndex={true}
              key={5}
              to="/cart"
              onClick={async () => {
                const loggedIn = await JSON.parse(
                  localStorage.getItem("userData")
                );
                if (!loggedIn)
                  browserHistory.push({
                    pathname: `/login`
                  });
              }}
              activeClassName="activeNavLink"
              className="navLink"
            >
              CART
            </Link>
          ) : null}
          {mq.matches ? (
            <Link
              onlyActiveOnIndex={true}
              key={6}
              to="/login"
              activeClassName="activeNavLink"
              className="navLink"
            >
              Log Out
            </Link>
          ) : null}
        </div>
        {!mq.matches ? (
          <div className="innerMenu innerMenuDirection2">
            <Link
              onlyActiveOnIndex={true}
              key={5}
              to="/cart"
              activeClassName="activeNavLink"
              className="cartMenu navLink"
            >
              CART
            </Link>
          </div>
        ) : null}
      </div>
    );

    this.loggedOutMenu = (
      <div className="menu loginMenu">
        <Link
          onlyActiveOnIndex={true}
          key={5}
          activeClassName="activeNavLink"
          className="navLink"
        >
          Login First!
        </Link>
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
    const loggedIn = JSON.parse(localStorage.getItem("userData"));
    if (!loggedIn)
      browserHistory.push({
        pathname: `/login`
      });
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
    browserHistory.push({
      pathname: `/login`,
      state: "logout"
    });
  }

  render() {
    return (
      <header className="header">
        <div className="headerExt">
          <Link onlyActiveOnIndex={true} to="/" className="logo">
            COUTURE HIJAB
          </Link>
          {!mq.matches ? (
            <Link
              onlyActiveOnIndex={true}
              key={4}
              onClick={this.logOut}
              activeClassName="activeNavLink"
              className="navLink login"
            >
              Login
            </Link>
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
