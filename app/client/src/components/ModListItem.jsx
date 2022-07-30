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
 * @author [Zach Bourque](zachbourque01@gmail)
 * @module
 */

import React, { useState } from "react";
import { connect } from "react-redux";
import {
  openDemoteUserModal,
  openEditModeratorPermissionsModal,
} from "../redux/ducks/modalDuck";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";

const ModListItem = (props) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDemoteClick = (mod) => {
    return () => {
      handleMenuClose();
      props.openDemoteUserModal(mod.username);
    };
  };

  const handleCommunityModeratorClick = (mod) => {
    if (mod) navigate(`/profile/${mod}`);
  };

  const handleEditModeratorPermissionsClick = (mod) => {
    handleMenuClose();
    props.openEditModeratorPermissionsModal(mod);
  };

  return (
    <Stack
      direction="row"
      spacing={0}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        pl: props.userIsModerator || props.role === "admin" ? 1.5 : 0,
        py: 0.2,
      }}
      key={props.mod.username}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          ":hover": {
            textDecoration: "underline",
            cursor: "pointer",
          },
        }}
        onClick={() => handleCommunityModeratorClick(props.mod.username)}
      >
        {props.mod.name ?? props.mod.username}
      </Typography>
      {(props.userIsModerator || props.role === "admin") && (
        <>
          <IconButton
            aria-label="settings"
            onClick={handleMenuOpen}
            sx={{ py: 0.2 }}
          >
            <AdminPanelSettingsIcon />
          </IconButton>
          <Menu open={!!anchorEl} onClose={handleMenuClose} anchorEl={anchorEl}>
            <MenuList>
              {(props.community.moderators
                ?.find((mod) => mod.userId === props.userId)
                ?.permissions?.includes("set_permissions") ||
                props.role === "admin") && (
                <MenuItem
                  onClick={() => {
                    handleEditModeratorPermissionsClick(props.mod);
                  }}
                  key={props.mod.username + "permissions"}
                >
                  <ListItemIcon>
                    <EditAttributesIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit Permissions</ListItemText>
                </MenuItem>
              )}
              <MenuItem onClick={handleDemoteClick(props.mod)}>
                <ListItemIcon>
                  <PersonRemoveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Demote</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      )}
    </Stack>
  );
};

const mapStateToProps = (state) => ({
  role: state.auth.user.role,
  userId: state.auth.user.id,
  community:
    state.communities.communities[state.communities.currentCommunityIndex] ??
    {},
});

const mapDispatchToProps = {
  openDemoteUserModal,
  openEditModeratorPermissionsModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModListItem);
