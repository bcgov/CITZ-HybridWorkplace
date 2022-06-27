//
// Copyright © 2022 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Application entry point
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
 * @module
 */
import { connect } from "react-redux";
import { logout } from "../redux/ducks/authDuck";
import React from "react";
import { Link } from "react-router-dom";
import "./sideMenu.css";
import Menu from "./icons/menuLogo.svg";
import House from "@mui/icons-material/House";
import Person from "@mui/icons-material/Person";
import HelpCenter from "@mui/icons-material/HelpCenter";
import LogOut from "@mui/icons-material/Logout";
import Group from "@mui/icons-material/Group";

const SideMenu = (props) => {
  async function openSlideMenu() {
    document.getElementById("menu").style.width = "250px";
    document.getElementById("menu").style.marginLeft = "250px";
  }

  async function closeSlideMenu() {
    document.getElementById("menu").style.width = "0px";
    document.getElementById("menu").style.marginLeft = "0px";
  }

  // Logout
  async function logOff() {
    props.logout();
  }

  return (
    <div id="content" style={{ zIndex: 500 }}>
      <span className="slide">
        <a href="#" onClick={openSlideMenu}>
          <img src={Menu} id="Menu" alt="Profile" />
        </a>
      </span>

      <div id="menu" className="nav">
        <a href="#" className="close" onClick={closeSlideMenu}>
          ✖
        </a>
        <ul>
          <li>
            <Link to="/">
              <House /> Home
            </Link>
          </li>
          <li>
            <Link to={`./profile/${props.auth.user.username}`}>
              <Person /> Profile
            </Link>
          </li>
          <li>
            <Link to="./communities">
              <Group /> Communities
            </Link>
          </li>
          <li>
            <Link to="./posts">
              <Group /> Posts
            </Link>
          </li>
          <li>
            <Link to="./about">
              <HelpCenter /> About
            </Link>
          </li>
          <li onClick={logOff}>
            <Link to="./login">
              <LogOut /> Log Off
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
