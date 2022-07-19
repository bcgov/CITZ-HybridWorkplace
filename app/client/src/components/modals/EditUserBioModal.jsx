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
import { closeEditUserBioModal } from "../../redux/ducks/modalDuck";
import { editUserBio } from "../../redux/ducks/profileDuck";
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

const EditUserBioModal = (props) => {
  const [bio, setBio] = useState(props.bio);

  useEffect(() => {
    setBio(props.userBio ?? "");
  }, [props.userBio]);

  const saveEdits = async () => {
    const userChanges = {
      bio,
    };

    const successful = await props.editUserBio(userChanges);
    if (successful === true) {
      props.closeEditUserBioModal();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeEditUserBioModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Edit User Bio</DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="user-bio">Bio</InputLabel>
            <TextField
              id="user-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              type="text"
              multiline
              rows={5}
              placeholder="Bio"
            />
          </Stack>
          <DialogActions>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button variant="contained" onClick={saveEdits}>
                Save
              </Button>
              <Button onClick={props.closeEditUserBioModal} color="button">Cancel</Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  open: state.modal.editUserBio.open,
  userBio: state.modal.editUserBio.userBio,
  profile: state.profile.user,
});

const mapActionsToProps = {
  closeEditUserBioModal,
  editUserBio,
};

export default connect(mapStateToProps, mapActionsToProps)(EditUserBioModal);
