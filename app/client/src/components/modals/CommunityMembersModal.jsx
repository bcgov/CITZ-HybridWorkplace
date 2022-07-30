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
 * @author [Brandon Bouchard](brandonjbouchard@gmail.com)
 * @module
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  TextField,
  Tooltip,
  Box,
  Badge,
} from "@mui/material";

import NoMeetingRoomRoundedIcon from "@mui/icons-material/NoMeetingRoomRounded";
import {
  closeCommunityMembersModal,
  openPromoteUserModal,
  openKickUserModal,
} from "../../redux/ducks/modalDuck";
import { getCommunityMembers } from "../../redux/ducks/communityDuck";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import PromoteUserModal from "./PromoteUserModal";
import AvatarIcon from "../AvatarIcon";
import { useNavigate } from "react-router-dom";
import KickUserModal from "./KickUserModal";

const CommunityMembersModal = (props) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    props.getCommunityMembers(props.community?.title);
  }, [props.open]);

  const handlePromoteClick = (username) => {
    props.openPromoteUserModal(username);
  };

  const search = (members) => {
    return members?.filter((member) => {
      const username = member.username?.toLowerCase();
      const firstName = member.firstName?.toLowerCase();
      const lastName = member.lastName?.toLowerCase();
      const fullName = `${member.firstName?.toLowerCase()} ${member.lastName?.toLowerCase()}`;
      return (
        username?.includes(query?.toLowerCase()) ||
        firstName?.includes(query?.toLowerCase()) ||
        lastName?.includes(query?.toLowerCase()) ||
        fullName?.includes(query?.toLowerCase())
      );
    });
  };

  const handleKickUserClick = (user) => props.openKickUserModal(user);

  const handleUserClick = (username) => {
    if (username) navigate(`/profile/${username}`);
    props.closeCommunityMembersModal();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeCommunityMembersModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Community Members</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ width: "100%" }}
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <Stack spacing={1}>
          <List>
            {search(props.community?.membersList)?.map((member) => {
              return props.isUserModerator ? (
                <ListItem
                  key={member._id}
                  secondaryAction={
                    <>
                      {member.isModerator && member.isModerator === true ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              border: "solid 1px",
                              borderRadius: "10px",
                              p: 0.5,
                            }}
                          >
                            Moderator
                          </Typography>
                        </Box>
                      ) : (
                        <Stack
                          direction="row"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Tooltip
                            title={<Typography>Promote</Typography>}
                            arrow
                          >
                            <IconButton
                              color="success"
                              onClick={() =>
                                handlePromoteClick(member.username)
                              }
                            >
                              <AddCircleTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={<Typography>Kick</Typography>} arrow>
                            <IconButton
                              edge="end"
                              aria-label="kick user"
                              color="error"
                              onClick={() => handleKickUserClick(member)}
                            >
                              <NoMeetingRoomRoundedIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Tooltip
                          title={
                            <Typography>
                              {member.online ? "Online" : "Offline"}
                            </Typography>
                          }
                          placement="left"
                          arrow
                        >
                          <Badge
                            badgeContent=" "
                            color={
                              member.online ? "onlineStatus" : "offlineStatus"
                            }
                            variant="dot"
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <AvatarIcon
                              type={member.avatar?.avatarType ?? ""}
                              initials={
                                member.lastName
                                  ? `${member.firstName?.charAt(
                                      0
                                    )}${member.lastName?.charAt(0)}`
                                  : member.firstName?.charAt(0) ??
                                    member.username?.charAt(0) ??
                                    ""
                              }
                              image={member.avatar?.image ?? ""}
                              gradient={member.avatar?.gradient ?? ""}
                              colors={member.avatar?.colors ?? {}}
                              size={30}
                            />
                          </Badge>
                        </Tooltip>
                        <Typography
                          sx={{
                            ":hover": {
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => handleUserClick(member.username)}
                        >
                          {member.lastName
                            ? `${member.firstName} ${member.lastName}`
                            : member.firstName ?? member.username}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              ) : (
                <ListItem key={member._id}>
                  <ListItemText
                    primary={
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <AvatarIcon
                          type={member.avatar?.avatarType ?? ""}
                          initials={
                            member.lastName
                              ? `${member.firstName?.charAt(
                                  0
                                )}${member.lastName?.charAt(0)}`
                              : member.firstName?.charAt(0) ??
                                member.username?.charAt(0) ??
                                ""
                          }
                          image={member.avatar?.image ?? ""}
                          gradient={member.avatar?.gradient ?? ""}
                          colors={member.avatar?.colors ?? {}}
                          size={30}
                        />
                        <Typography
                          sx={{
                            ":hover": {
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => handleUserClick(member.username)}
                        >
                          {member.lastName
                            ? `${member.firstName} ${member.lastName}`
                            : member.firstName ?? member.username}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
          <PromoteUserModal />
          <KickUserModal />
          <DialogActions
            sx={{
              m: 0,
              pb: 0,
            }}
          >
            <Stack spacing={1} justifyContent="end">
              <Button
                variant="contained"
                onClick={props.closeCommunityMembersModal}
              >
                Close
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

CommunityMembersModal.propTypes = {
  getCommunityMembers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  open: state.modal.editCommunityMembers.open,
  community:
    state.communities.communities[state.communities.currentCommunityIndex],
});

const mapActionsToProps = {
  closeCommunityMembersModal,
  getCommunityMembers,
  openPromoteUserModal,
  openKickUserModal,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CommunityMembersModal);
