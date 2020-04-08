/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";

class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return (
      <div className="paymentMainDiv">
        <h3 className="paymentTitle">Current Payment</h3>
        <p className="paymentContent">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit ut
          tortor pretium viverra suspendisse potenti nullam ac tortor. Mauris
          nunc congue nisi vitae suscipit tellus mauris. Ac orci phasellus
          egestas tellus rutrum tellus pellentesque eu tincidunt. Turpis in eu
          mi bibendum neque. Interdum varius sit amet mattis vulputate enim.
          Velit egestas dui id ornare arcu odio ut sem nulla. Faucibus purus in
          massa tempor nec feugiat nisl pretium fusce. Vivamus arcu felis
          bibendum ut tristique et egestas. Tempor orci eu lobortis elementum
          nibh tellus.
        </p>
        <p className="paymentTotal">Total:</p>
      </div>
    );
  }
}

export default withRouter(PaymentPage);
