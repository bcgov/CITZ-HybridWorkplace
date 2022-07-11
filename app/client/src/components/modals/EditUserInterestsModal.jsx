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
import PropTypes from "prop-types";
import { closeEditUserInterestsModal } from "../../redux/ducks/modalDuck";
import {
  Autocomplete,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Stack,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { editUserInterests } from "../../redux/ducks/profileDuck";

const EditUserInterestsModal = (props) => {
  const [interests, setInterests] = useState(props.interests.interests);

  useEffect(() => {
    setInterests(props.interests.interests);
  }, [props.interests.interests]);

  const saveEdits = async () => {
    const userChanges = {
      interests: interests,
    };

    const successful = await props.editUserInterests(userChanges);
    if (successful === true) {
      props.closeEditUserInterestsModal();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeEditUserInterestsModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Edit User Interests
        </Typography>
      </DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1}>
          <Stack spacing={0.5}>
            <Autocomplete
              multiple
              id="user-interests"
              defaultValue={props.profile.interests?.map(
                (interest) => interest
              )}
              options={props.profile.interests}
              freeSolo
              renderTags={(value, getTagProps) => {
                setInterests(value);
                return value.map((option, index) => {
                  return (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  );
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Interests"
                  helperText="Press ENTER to submit an interest. Interest length must be between 3-16 characters."
                />
              )}
            />
          </Stack>

          <DialogActions>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button variant="contained" onClick={saveEdits}>
                Save
              </Button>
              <Button
                variant="contained"
                onClick={props.closeEditUserInterestsModal}
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

EditUserInterestsModal.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.auth,
  interests: state.modal.editUserInterests.interests,
  open: state.modal.editUserInterests.open,
  profile: state.profile.user,
});

const mapActionsToProps = {
  closeEditUserInterestsModal,
  editUserInterests,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(EditUserInterestsModal);
