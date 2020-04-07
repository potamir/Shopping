/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles.sass";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { styled } from "@material-ui/core/styles";
import * as constant from "../constant.js";

const address = constant.ENDPOINT;
const StyledFormControl = styled(FormControl)({
  margin: 5,
  minWidth: 400,
});

class Origin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provs: [],
      cities: [],
      selectedProvId: "",
      selectedCityId: "",
      selectedProvName: "",
      selectedCityName: "",
      currProvName: "",
      currCityName: "",
    };
    this.dropdownHandler = this.dropdownHandler.bind(this);
    this.setOrigin = this.setOrigin.bind(this);
  }

  async componentDidMount() {
    await this.getOrigin();
    this.getProv();
  }

  dropdownHandler(_state1, value1, _state2, value2, type) {
    let newValue2 = value2;
    if (type) newValue2 = `${type} ${value2}`;
    this.setState({ [_state1]: value1, [_state2]: newValue2 });
  }

  async getProv() {
    await fetch(`http://${address}/shp_get_all`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.status)
          this.setState({
            provs: responseJson.provs.rajaongkir.results,
            cities: responseJson.cities.rajaongkir.results,
          });
      });
  }

  async getOrigin() {
    await fetch(`http://${address}/origin_get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({
          currProvName: responseJson[0].province_name,
          currCityName: responseJson[0].city_name,
        });
      });
  }

  async setOrigin() {
    const _state = this.state;
    await fetch(`http://${address}/origin_post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prov_id: _state.selectedProvId,
        city_id: _state.selectedCityId,
        prov_name: _state.selectedProvName,
        city_name: _state.selectedCityName,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.status === "success") window.location.reload();
        else console.log(status);
      });
  }

  render() {
    return (
      <div className="OriginMain">
        <h3 className="OriginTitle">Set Origin Address</h3>
        <div className="dropdownLocation dropdownOrigin">
          <StyledFormControl>
            <InputLabel htmlFor="grouped-select">Province</InputLabel>
            <Select
              onChange={(e) =>
                this.dropdownHandler(
                  "selectedProvId",
                  e.target.value.province_id,
                  "selectedProvName",
                  e.target.value.province
                )
              }
              defaultValue=""
              id="grouped-select"
            >
              {this.state.provs.map((value, index) => {
                return (
                  <MenuItem key={index} value={value}>
                    {value.province}
                  </MenuItem>
                );
              })}
            </Select>
          </StyledFormControl>
          <StyledFormControl>
            <InputLabel htmlFor="grouped-select">City</InputLabel>
            <Select
              onChange={(e) =>
                this.dropdownHandler(
                  "selectedCityId",
                  e.target.value.city_id,
                  "selectedCityName",
                  e.target.value.city_name,
                  e.target.value.type
                )
              }
              defaultValue=""
              id="grouped-select"
            >
              {this.state.cities.map((value, index) => {
                if (value.province_id === this.state.selectedProvId) {
                  return (
                    <MenuItem key={index} value={value}>
                      {value.type} {value.city_name}
                    </MenuItem>
                  );
                } else return null;
              })}
            </Select>
          </StyledFormControl>
        </div>
        <div className="btnWrapper OriginBtn">
          <button className="loginBtn normalBtn" onClick={this.setOrigin}>
            Save Changes
          </button>
        </div>
        <div className="currOriginWrapper">
          <h4 className="currOriginTitle">-Current Origin-</h4>
          <p className="currOriginContent">{this.state.currProvName}</p>
          <p className="currOriginContent">{this.state.currCityName}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(Origin);
