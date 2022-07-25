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

import React, { useState, useEffect } from "react";
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
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";

import { closeSettingsModal } from "../../redux/ducks/modalDuck";
import { editUserSettings } from "../../redux/ducks/profileDuck";

const SettingsModal = (props) => {
  const notificationPreferences = [
    { value: "none", label: "None", disabled: false },
    { value: "immediate", label: "Immediate", disabled: false },
    { value: "daily", label: "Daily", disabled: false },
    { value: "weekly", label: "Weekly", disabled: true },
    { value: "monthly", label: "Monthly", disabled: true },
  ];
  const [darkModeValue, setDarkModeValue] = useState(
    localStorage.getItem("hwp-darkmode") ?? "light"
  );

  const [notificationFrequency, setNotificationFrequency] = useState(
    props.userSettings.notificationFrequency || null
  );

  useEffect(() => {
    setNotificationFrequency(props.userSettings.notificationFrequency);
  }, [props.userSettings.notificationFrequency]);

  const saveEdits = async () => {
    const userChanges = {
      notificationFrequency,
    };

    const successful = await props.editUserSettings(userChanges);

    if (successful === true) props.closeSettingsModal();
  };

  const handleDarkModeChange = (e) => {
    setDarkModeValue(e.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("hwp-darkmode", darkModeValue);
    window.location.reload();
  };

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
      <DialogTitle fontWeight={600}>Settings</DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1} justifyContent="center">
          <FormControl>
            <FormLabel id="notification-frequency-radios-label" color="neutral">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </FormLabel>
            <Divider />
            <RadioGroup
              aria-labelledby="notification-frequency-radios-label"
              defaultValue="immediate"
              value={notificationFrequency}
              name="notification-frequency-radios-group"
              onChange={(e) => setNotificationFrequency(e.target.value)}
            >
              {notificationPreferences.map((item) => (
                <FormControlLabel
                  {...item}
                  key={item.value}
                  control={
                    <Radio value={item.value} size="medium" color="button"/>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel id="darkmode-preference-label" color="neutral">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Dark Mode
              </Typography>
            </FormLabel>
            <Divider />

            <Stack direction="row" spacing={1}>
              <Select
                name="darkmode-preference-label"
                labelId="darkmode-preference-label"
                id="demo-simple-select"
                aria-labelledby="darkmode-preference-label"
                value={darkModeValue}
                onChange={handleDarkModeChange}
              >
                <MenuItem value={"light"}>Light</MenuItem>
                <MenuItem value={"dark"}>Dark</MenuItem>
                <MenuItem value={"system"}>System Default</MenuItem>
              </Select>
            </Stack>
          </FormControl>
          <DialogActions sx={{ m: 0, pb: 0 }}>
            <Stack direction="row-reverse" justifyContent="end" spacing={1}>
              <Button
                variant="contained"
                onClick={() => {
                  saveEdits();
                  handleSave();
                }}
              >
                Save
              </Button>
              <Button onClick={props.closeSettingsModal} color="button">Close</Button>
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
  open: state.modal.editSettings.open,
  userSettings: state.modal.editSettings.userSettings,
});

const mapActionsToProps = {
  closeSettingsModal,
  editUserSettings,
};

export default connect(mapStateToProps, mapActionsToProps)(SettingsModal);
