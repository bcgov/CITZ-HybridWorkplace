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
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Stack,
  InputLabel,
  DialogActions,
  Radio,
} from "@mui/material";

import { closeEditAvatarModal } from "../../redux/ducks/modalDuck";

const EditAvatarModal = (props) => {
  const [avatar, setAvatar] = useState(props.avatar);

  const updateAvatar = async (event) => {
    event.preventDefault();
    const edit = {
      avatar,
    };

    // const successful = await props.createPost(edit);
    // if (successful === true) {
    //   props.closeEditAvatarModal();
    // }
  };

  const handleChange = (event) => {
    setAvatar(event.target.value);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeEditAvatarModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Add Post
        </Typography>
      </DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1}>
          <Stack container spacing={0.5}>
            <InputLabel htmlFor="add-post-title">Title</InputLabel>
            <Radio
              checked={avatar === "a"}
              onChange={handleChange}
              value="a"
              name="radio-buttons"
              inputProps={{ "aria-label": "A" }}
            />
            <Radio
              checked={avatar === "b"}
              onChange={handleChange}
              value="b"
              name="radio-buttons"
              inputProps={{ "aria-label": "B" }}
            />
          </Stack>
          <DialogActions
            sx={{
              m: 0,
              pb: 0,
            }}
          >
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button variant="contained" onClick={updateAvatar}>
                Save
              </Button>
              <Button variant="contained" onClick={props.closeEditAvatarModal}>
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

EditAvatarModal.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.auth,
  open: state.modal.editAvatar.open,
});

export default connect(mapStateToProps, {
  closeEditAvatarModal,
})(EditAvatarModal);
