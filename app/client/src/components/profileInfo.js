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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getProfile } from "../redux/ducks/profileDuck";
import PropTypes from "prop-types";

const Profile = (props) => {
  useEffect(() => {
    props.getProfile(props.username);
  });

  return (
    <div>
      <h3>{props.profile.username || ""}</h3>
      <h4>{props.profile.firstName + " " + props.profile.lastName}</h4>
      <p> {props.profile.email} </p>
      <p> {props.profile.title || ""} </p>
      <br />
      <p> {props.profile.bio || ""} </p>
    </div>
  );
};

Profile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.user,
});

const mapActionsToProps = {
  getProfile,
};

export default connect(mapStateToProps, mapActionsToProps)(Profile);
