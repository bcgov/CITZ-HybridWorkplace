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
import { closeAdminEditUserInfoModal } from "../../redux/ducks/modalDuck";
import PropTypes from "prop-types";
import { useState } from "react";

const AdminEditUserModal = (props) => {

  const closeModal = () => {
    props.closeAdminEditUserInfoModal();
  };

  return (
    <Dialog
      onClose={closeModal}
      open={props.open}
      sx={{ zIndex: 500 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Editing {props.username}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}}>
        <TextField label="First Name" defaultValue={props.user.firstName}/>
        <TextField label="Last Name" defaultValue={props.user.lastName}/>
        <TextField label="Title" defaultValue={props.user.title}/>
        <TextField label="Ministry" defaultValue={props.user.ministry}/>
        </Stack>

      </DialogContent>

      <DialogActions>
        <Stack spacing={1} direction="row-reverse" justifyContent="end">
          <Button variant="contained">
            Edit
          </Button>
          <Button onClick={closeModal} color="button">
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

AdminEditUserModal.propTypes = {
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  open: state.modal.adminEditUser.open,
  user: state.modal.adminEditUser.user,
});

const mapActionsToProps = {
  closeAdminEditUserInfoModal,
};

export default connect(mapStateToProps, mapActionsToProps)(AdminEditUserModal);
