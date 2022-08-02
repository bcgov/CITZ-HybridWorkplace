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
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { useEffect } from "react";
import { closeAdminGetUserModal } from "../../redux/ducks/modalDuck";
import { getProfile } from "../../redux/ducks/profileDuck";
import PropTypes from "prop-types";

const AdminGetUserModal = (props) => {
  const closeModal = () => props.closeAdminGetUserModal();

  useEffect(() => {
    if (props.username) props.getProfile(props.username);
  }, [props.open]);

  useEffect(() => {}, [props.user]);

  return (
    <Dialog
      onClose={closeModal}
      open={props.open}
      sx={{ zIndex: 500, maxHeight: "90vh" }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>User: {props.username}</DialogTitle>
      <DialogContent>
        <Typography>
          {props.user && JSON.stringify(props.user, null, " ")}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Stack spacing={1} direction="row-reverse" justifyContent="end">
          <Button onClick={closeModal} color="button">
            Close
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

AdminGetUserModal.propTypes = {
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  open: state.modal.adminGetUser.open,
  username: state.modal.adminGetUser.username,
  user: state.profile.user,
});

const mapActionsToProps = {
  closeAdminGetUserModal,
  getProfile,
};

export default connect(mapStateToProps, mapActionsToProps)(AdminGetUserModal);
