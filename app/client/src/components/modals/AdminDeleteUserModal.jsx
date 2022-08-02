/* 
 Copyright © 2022 Province of British Columbia

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Application entry point
 * @author [Zach Bourque](bettesworthjayna@gmail.com)
 * @module
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { closeAdminDeleteUserModal } from "../../redux/ducks/modalDuck";
import { adminDeleteUser } from "../../redux/ducks/adminDuck";
import PropTypes from "prop-types";
import { useState } from "react";

const AdminDeleteUserModal = (props) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDeleteUser = async () => {
    const successful = await props.adminDeleteUser(props.username);
    if (successful === true) {
      closeModal()
      props.sideEffect?.();
    }
  };

  const closeModal = () => {props.closeAdminDeleteUserModal(); setInputValue("");}

  return (
    <Dialog
      onClose={closeModal}
      open={props.open}
      sx={{ zIndex: 500 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Delete {props.username}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack spacing={1} textAlign="center" alignContent="center">
            <Typography variant="body1">
              Are you sure you want to delete this user?
            </Typography>
            <Typography variant="body2">
              This action <b>cannot</b> be undone. This will delete the user{" "}
              <b>{props.username}</b> and all of their saved info permanently.
            </Typography>
          </Stack>
          <InputLabel>Type <b>{props.username}</b> to confirm</InputLabel>
          <TextField
            value={inputValue}
            onChange={handleInputChange}
            size="small"
          />
          <DialogActions>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                onClick={handleDeleteUser}
                variant="contained"
                color="error"
                disabled={inputValue !== props.username}
              >
                Delete
              </Button>
              <Button onClick={closeModal} color="button">
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

AdminDeleteUserModal.propTypes = {
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  open: state.modal.adminDeleteUser.open,
  username: state.modal.adminDeleteUser.user.username,
});

const mapActionsToProps = {
  closeAdminDeleteUserModal,
  adminDeleteUser,
};

export default connect(mapStateToProps, mapActionsToProps)(AdminDeleteUserModal);
