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

import React, { useEffect } from "react";
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
} from "@mui/material";

import NoMeetingRoomRoundedIcon from "@mui/icons-material/NoMeetingRoomRounded";
import {
  closeCommunityMembersModal,
  openPromoteUserModal,
} from "../../redux/ducks/modalDuck";
import {
  getCommunityMembers,
  kickCommunityMember,
} from "../../redux/ducks/communityDuck";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import PromoteUserModal from "./PromoteUserModal";
import AvatarIcon from "../AvatarIcon";
import { useNavigate } from "react-router-dom";

const CommunityMembersModal = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    props.getCommunityMembers(props.community.title);
  }, [props.open]);

  const handlePromoteClick = () => {
    props.openPromoteUserModal();
  };

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
        <Stack spacing={1}>
          <List>
            {props.community.membersList?.map((member) => {
              return props.isUserModerator ? (
                <ListItem
                  key={member._id}
                  secondaryAction={
                    <Stack
                      direction="row"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <IconButton color="success" onClick={handlePromoteClick}>
                        <AddCircleTwoToneIcon fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" aria-label="kick user">
                        <NoMeetingRoomRoundedIcon />
                      </IconButton>
                    </Stack>
                  }
                >
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
                        <PromoteUserModal username={member.username} />
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
                        <PromoteUserModal username={member.username} />
                      </Stack>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
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
  kickCommunityMember,
  getCommunityMembers,
  openPromoteUserModal,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CommunityMembersModal);
