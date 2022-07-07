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

import React from "react";
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
  Switch,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
} from "@mui/material";

import { closeSettingsModal } from "../../redux/ducks/modalDuck";
import { editUserNotifications } from "../../redux/ducks/profileDuck";

const SettingsModal = (props) => {
  const handleEditNotificationsClick = () => props.editUserNotifications;

  return (
    <Dialog
      open={props.open}
      onClose={props.closeSettingsModal}
      fullWidth
      sx={{
        zIndex: 500,
        mb: 5,
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
      </DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1} justifyContent="center">
          <FormControl>
            <FormLabel id="notification-frequency-radios-label">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </FormLabel>
            <Divider />
            <RadioGroup
              aria-labelledby="notification-frequency-radios-label"
              defaultValue="immediately"
              name="notification-frequency-radios-group"
            >
              <FormControlLabel
                value="none"
                control={<Radio size="small" />}
                label="None"
              />
              <FormControlLabel
                value="immediately"
                control={<Radio size="small" />}
                label="Immediately"
              />
              <FormControlLabel
                value="daily"
                control={<Radio size="small" />}
                label="Daily"
              />
              <FormControlLabel
                disabled
                value="weekly"
                control={<Radio size="small" />}
                label="Weekly"
              />
              <FormControlLabel
                disabled
                value="monthly"
                control={<Radio size="small" />}
                label="Monthly"
              />
            </RadioGroup>
          </FormControl>
          <Divider />
          <Stack direction="row" spacing={1}>
            <Typography
              variant="p"
              sx={{ fontWeight: 600, alignSelf: "center" }}
            >
              Dark Mode
            </Typography>
            <Switch />
          </Stack>
          <DialogActions sx={{ m: 0, pb: 0 }}>
            <Stack direction="row-reverse" justifyContent="end" spacing={1}>
              <Button
                variant="contained"
                onClick={handleEditNotificationsClick}
              >
                Save
              </Button>
              <Button variant="contained" onClick={props.closeSettingsModal}>
                Close
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

// TODO: PropTypes

const mapStateToProps = (state) => ({
  auth: state.auth,
  open: state.modal.settings.open,
  notificationFrequency: state.profile.notificationFrequency,
});

const mapActionsToProps = {
  closeSettingsModal,
  editUserNotifications,
};

export default connect(mapStateToProps, mapActionsToProps)(SettingsModal);
