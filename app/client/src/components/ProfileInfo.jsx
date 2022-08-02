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
 * @author [Brandon Bouchard](brandonjbouchard@gmail.com)
 * @module
 */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { getProfile } from "../redux/ducks/profileDuck";
import PropTypes from "prop-types";
import { Typography, Box, Stack, IconButton, Divider } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { openEditUserInfoModal } from "../redux/ducks/modalDuck";
import EditUserInfoModal from "./modals/EditUserInfoModal";

const ProfileInfo = (props) => {
  const body2TextColor = "#999";

  const registeredOn = props.profile.registeredOn || "";
  const registrationDate = registeredOn.split(",")[0];

  let name = props.profile.firstName || props.profile.username;
  if (props.profile.firstName && props.profile.lastName)
    name += ` ${props.profile.lastName}`;

  const handleEditUserInfoClick = (userInfo) =>
    props.openEditUserInfoModal(userInfo);
  // comment for rebuild
  return (
    <Box width="max-content">
      <Stack spacing={2} minWidth="10rem">
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center">
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "neutral.main" }}
            >
              {name || ""}
            </Typography>
            {props.username === props.profile.username && (
              <IconButton
                onClick={() => handleEditUserInfoClick(props.profile)}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            )}
            <EditUserInfoModal />
          </Stack>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: body2TextColor }}
          >
            {props.profile.title || ""}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: body2TextColor }}
          >
            {props.profile.ministry || ""}
          </Typography>
        </Stack>

        <Stack spacing={0.5} sx={{ my: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "neutral.main" }}
          >
            Joined
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: body2TextColor }}
          >
            {registrationDate || ""}
          </Typography>
        </Stack>
        <Stack spacing={0.5} sx={{ my: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "neutral.main" }}
          >
            Posts
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: body2TextColor }}
          >
            {props.profile.postCount || 0}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

ProfileInfo.propTypes = {
  getProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  username: state.auth.user.username,
  profile: state.profile.user,
});

const mapActionsToProps = { getProfile, openEditUserInfoModal };

export default connect(mapStateToProps, mapActionsToProps)(ProfileInfo);
