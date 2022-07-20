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
  Typography,
  Button,
  Stack,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";

import NoMeetingRoomRoundedIcon from "@mui/icons-material/NoMeetingRoomRounded";
import { closeCommunityMembersModal } from "../../redux/ducks/modalDuck";
import {
  getCommunityMembers,
  kickCommunityMember,
} from "../../redux/ducks/communityDuck";

const CommunityMembersModal = (props) => {
  useEffect(() => {
    props.getCommunityMembers(props.community.title);
  }, [props.open, props.community.membersList]);

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
            {props.community.membersList.map((member) => {
              return props.isUserModerator ? (
                <ListItem
                  key={member._id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="kick user">
                      <NoMeetingRoomRoundedIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.firstName
                    }
                  />
                </ListItem>
              ) : (
                <ListItem key={member._id} disablePadding>
                  <ListItemText primary={member} />
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
  members: PropTypes.array.isRequired,
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
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CommunityMembersModal);
