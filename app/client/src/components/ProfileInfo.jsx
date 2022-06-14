//
// Copyright Â© 2022 Province of British Columbia
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

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getProfile } from "../redux/ducks/profileDuck";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const ProfileInfo = (props) => {
  useEffect(() => {
    props.getProfile(props.username);
  });

  const registeredOn = props.profile.registeredOn || "";
  const registartionDate = registeredOn.split(",")[0];

  let name = props.profile.firstName || props.username;
  if (props.profile.firstName && props.profile.lastName)
    name += ` ${props.profile.lastName}`;

  return (
    <div>
      <Typography variant="h4" style={{ fontWeight: 600, color: "#313132" }}>
        {props.profile.username}
      </Typography>
      <Typography variant="h5">{name || "No name to display"}</Typography>
      <Typography variant="body2"> {props.profile.email} </Typography>
      <Typography variant="body2">
        {props.profile.title || "No title to display"}
      </Typography>
      <br />
      <Typography variant="h6" style={{ fontWeight: 600, color: "#313132" }}>
        Joined
      </Typography>
      <Typography variant="p" style={{ fontWeight: 600, color: "#999" }}>
        {registartionDate || "No join date to display"}
      </Typography>
      <br />
      <Typography variant="h6" style={{ fontWeight: 600, color: "#313132" }}>
        Posts
      </Typography>
      <Typography variant="p" style={{ fontWeight: 600, color: "#999" }}>
        {props.profile.postCount || 0}
      </Typography>
    </div>
  );
};

ProfileInfo.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.user,
});

const mapActionsToProps = { getProfile };

export default connect(mapStateToProps, mapActionsToProps)(ProfileInfo);
