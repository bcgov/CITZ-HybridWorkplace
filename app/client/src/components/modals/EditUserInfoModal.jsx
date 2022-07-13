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

import React, { useState } from "react";
import { connect } from "react-redux";
import { closeEditUserInfoModal } from "../../redux/ducks/modalDuck";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  InputLabel,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { editUserInfo } from "../../redux/ducks/profileDuck";

const EditUserInfoModal = (props) => {
  const user = props.userInfo;
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [title, setTitle] = useState(user.title);
  const [ministry, setMinistry] = useState(user.ministry);

  useEffect(() => {
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setTitle(user.title ?? "");
    setMinistry(user.ministry ?? "");
  }, [props.userInfo]);

  const saveEdits = async () => {
    const userChanges = {
      firstName,
      lastName,
      title,
      ministry,
    };

    const successful = await props.editUserInfo(userChanges);
    if (successful === true) {
      props.closeEditUserInfoModal();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeEditUserInfoModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Edit User Info.</DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="user-firstName">First Name</InputLabel>
            <TextField
              id="user-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="First Name"
            />
            <InputLabel htmlFor="user-lastName">Last Name</InputLabel>
            <TextField
              id="user-lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Last Name"
            />
            <InputLabel htmlFor="user-title">Title</InputLabel>
            <TextField
              id="user-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
            />
            <InputLabel htmlFor="user-ministry">Ministry</InputLabel>
            <TextField
              id="user-ministry"
              value={ministry}
              onChange={(e) => setMinistry(e.target.value)}
              type="text"
              placeholder="Ministry"
            />
          </Stack>

          <DialogActions>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button variant="contained" onClick={saveEdits}>
                Save
              </Button>
              <Button
                variant="contained"
                onClick={props.closeEditUserInfoModal}
              >
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  userInfo: state.modal.editUserInfo.userInfo,
  open: state.modal.editUserInfo.open,
});

const mapActionsToProps = {
  closeEditUserInfoModal,
  editUserInfo,
};

export default connect(mapStateToProps, mapActionsToProps)(EditUserInfoModal);
