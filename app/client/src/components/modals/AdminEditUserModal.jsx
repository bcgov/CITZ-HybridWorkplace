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
  Stack,
  TextField,
} from "@mui/material";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { closeAdminEditUserInfoModal } from "../../redux/ducks/modalDuck";
import { getProfile } from "../../redux/ducks/profileDuck";
import PropTypes from "prop-types";

const AdminEditUserModal = (props) => {
  const closeModal = () => props.closeAdminEditUserInfoModal();

  // Edit User
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [ministry, setMinistry] = useState("");
  const [bio, setBio] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [notificationFrequency, setNotificationFrequency] = useState("");
  const [registeredOn, setRegisteredOn] = useState("");

  useEffect(() => {
    if (props.username) props.getProfile(props.username);
  }, [props.open]);

  useEffect(() => {
    setUsername(props.user?.username);
    setEmail(props.user?.email);
    setRole(props.user?.role);
    setFirstName(props.user?.firstName);
    setLastName(props.user?.lastName);
    setTitle(props.user?.title);
    setMinistry(props.user?.ministry);
    setBio(props.user?.bio);
    setPostCount(props.user?.postCount);
    setNotificationFrequency(props.user?.notificationFrequency);
    setRegisteredOn(props.user?.registeredOn);
  }, [props.user]);

  const onUsernameChange = (event) => setUsername(event.target.value);
  const onEmailChange = (event) => setEmail(event.target.value);
  const onRoleChange = (event) => setRole(event.target.value);
  const onFirstNameChange = (event) => setFirstName(event.target.value);
  const onLastNameChange = (event) => setLastName(event.target.value);
  const onTitleChange = (event) => setTitle(event.target.value);
  const onMinistryChange = (event) => setMinistry(event.target.value);
  const onBioChange = (event) => setBio(event.target.value);
  const onPostCountChange = (event) => setPostCount(event.target.value);
  const onNotificationFrequencyChange = (event) =>
    setNotificationFrequency(event.target.value);
  const onRegisteredOnChange = (event) => setRegisteredOn(event.target.value);

  const onEditClick = () => {
    // TODO
  };

  return (
    <Dialog
      onClose={closeModal}
      open={props.open}
      sx={{ zIndex: 500, maxHeight: "90vh" }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Editing {props.username}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Username"
            value={username}
            onChange={onUsernameChange}
          />
          <TextField label="Email" value={email} onChange={onEmailChange} />
          <TextField label="Role" value={role} onChange={onRoleChange} />
          <TextField
            label="First Name"
            value={firstName}
            onChange={onFirstNameChange}
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={onLastNameChange}
          />
          <TextField label="Title" value={title} onChange={onTitleChange} />
          <TextField
            label="Ministry"
            value={ministry}
            onChange={onMinistryChange}
          />
          <TextField label="Bio" value={bio} onChange={onBioChange} />
          <TextField
            label="Post Count"
            value={postCount}
            onChange={onPostCountChange}
          />
          <TextField
            label="Notification Frequency"
            value={notificationFrequency}
            onChange={onNotificationFrequencyChange}
          />
          <TextField
            label="Registered On"
            value={registeredOn}
            onChange={onRegisteredOnChange}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Stack spacing={1} direction="row-reverse" justifyContent="end">
          <Button onClick={onEditClick} variant="contained">
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
  username: state.modal.adminEditUser.username,
  user: state.profile.user,
});

const mapActionsToProps = {
  closeAdminEditUserInfoModal,
  getProfile,
};

export default connect(mapStateToProps, mapActionsToProps)(AdminEditUserModal);
