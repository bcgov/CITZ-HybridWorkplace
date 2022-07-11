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
import { getProfile } from "../redux/ducks/profileDuck";
import PropTypes from "prop-types";
import { Typography, Box, Stack, IconButton, Divider } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { openEditUserInfoModal } from "../redux/ducks/modalDuck";
import EditUserInfoModal from "./modals/EditUserInfoModal";
import { useTheme } from "@emotion/react";

const ProfileInfo = (props) => {
  const theme = useTheme();
  const neutralTextColor = theme.palette.neutral.main;
  const body2TextColor = "#999";
  useEffect(() => {
    props.getProfile(props.username);
  }, []);

  const registeredOn = props.profile.registeredOn || "";
  const registrationDate = registeredOn.split(",")[0];

  let name = props.profile.firstName || props.username;
  if (props.profile.firstName && props.profile.lastName)
    name += ` ${props.profile.lastName}`;

  const handleEditUserInfoClick = (userInfo) =>
    props.openEditUserInfoModal(userInfo);
  // comment for rebuild
  return (
    <Box width="max-content">
      <Stack spacing={0.5} minWidth="10rem">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: neutralTextColor }}
          >
            {name || "No name to display."}
          </Typography>
          <IconButton onClick={() => handleEditUserInfoClick(props.profile)}>
            <EditRoundedIcon fontSize="small" />
          </IconButton>
          <EditUserInfoModal />
        </Stack>

        <Typography variant="body2" sx={{ color: body2TextColor }}>
          {props.profile.title || "No title to display"}
        </Typography>
        <Typography variant="body2" sx={{ color: body2TextColor }}>
          {props.profile.ministry || "No ministry to display"}
        </Typography>
        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            style={{ fontWeight: 600, color: neutralTextColor }}
          >
            Joined
          </Typography>
          <Typography
            variant="body2"
            style={{ fontWeight: 600, color: body2TextColor }}
          >
            {registrationDate || "No join date to display"}
          </Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: neutralTextColor }}
          >
            Posts
          </Typography>
          <Typography
            variant="body2"
            style={{ fontWeight: 600, color: body2TextColor }}
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
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.user,
});

const mapActionsToProps = { getProfile, openEditUserInfoModal };

export default connect(mapStateToProps, mapActionsToProps)(ProfileInfo);
