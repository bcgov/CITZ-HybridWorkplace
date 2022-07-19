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
  InputLabel,
} from "@mui/material";
import { useEffect } from "react";
import { editUserInterests } from "../../redux/ducks/profileDuck";
import { Box } from "@mui/system";

const EditUserInterestsModal = (props) => {
  const [interests, setInterests] = useState(props.profile.interests);
  const [interestInput, setInterestInput] = useState("");
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    setInterests(props.profile.interests);
  }, [props.interests]);

  const saveEdits = async () => {
    const userChanges = {
      interests: interests,
    };

    const successful = await props.editUserInterests(userChanges);
    if (successful === true) {
      props.closeEditUserInterestsModal();
    }
  };
  const handleChipDelete = (index) => {
    setInterests((prev) => prev.filter((item, i) => i !== index));
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    const input = e.target.TagInput.value
    if (input.length < 3) {
      setInputError(true)
      return
    } 
    setInterests((prev) => [...prev, e.target.TagInput.value]);
    setInterestInput("");
    setInputError(false)
    console.log(e.target.TagInput.value);
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.closeEditUserInterestsModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Edit User Info.</DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1}>
          <form onSubmit={handleTagSubmit}>
            <InputLabel htmlFor="tag-input" error={inputError}>Interests</InputLabel>
            <TextField
            sx={{pt: 0}}
              name="TagInput"
              id="tag-input"
              error={inputError}
              size="small"
              fullWidth
              variant="filled"
              helperText="Press ENTER to submit an interest. Interest length must be between 3-16 characters."
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Stack direction="row" spacing={0}>
                    {interests?.map((data, index) => {
                      return (
                        <Chip
                          label={data}
                          onDelete={() => handleChipDelete(index)}
                        ></Chip>
                      );
                    })}
                  </Stack>
                ),
              }}
            />
          </form>

          <DialogActions>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button variant="contained" onClick={saveEdits}>
                Save
              </Button>
              <Button onClick={props.closeEditUserInterestsModal}>
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
