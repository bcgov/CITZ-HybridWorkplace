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
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
 * @module
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createCommunity } from "../../redux/ducks/communityDuck";
import {
  Autocomplete,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Stack,
  InputLabel,
  DialogActions,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { closeAddCommunityModal } from "../../redux/ducks/modalDuck";
import MDEditor from "@uiw/react-md-editor";

const AddCommunityModal = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [createCommunityLoading, setCreateCommunityLoading] = useState(false);
  const [tags, setTags] = useState([]);

  async function registerCommunity() {
    setCreateCommunityLoading(true);

    const formattedTags = tags.map((tag) => ({ tag: tag, count: 0 }));

    const community = {
      title: title,
      description: description,
      rules: rules,
      tags: formattedTags,
    };

    const successful = await props.createCommunity(community);

    setCreateCommunityLoading(false);
    if (successful === true) {
      props.onClose();
      navigate("/");
    }
  }

  const handleTags = (tags) => {
    setTags(tags);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeAddCommunityModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Create Community
        </Typography>
      </DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="create-community-title">Title</InputLabel>
            <TextField
              id="create-community-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              error={
                title === "" || (title.length >= 3 && title.length <= 25)
                  ? false
                  : true
              }
              helperText="Title must be 3-25 characters in length."
              required
            />
          </Stack>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="create-community-description">
              Description
            </InputLabel>
            <TextField
              id="create-community-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              multiline
              maxRows={3}
              placeholder="Description"
              error={
                description === "" ||
                (description.length >= 3 && description.length <= 300)
                  ? false
                  : true
              }
              helperText="Description is required."
              required
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="create-community-rules">Rules</InputLabel>
            <TextField
              id="create-community-rules"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              type="text"
              multiline
              maxRows={3}
              placeholder="Rules"
              error={false}
              helperText="Rules is required."
              required
            />
          </Stack>

          <Autocomplete
            multiple
            id="tags-filled"
            limitTags={7}
            options={[]}
            freeSolo
            renderTags={(value, getTagProps) => {
              handleTags(value);
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
                label="Custom Tags"
                placeholder="Tags"
                helperText="Press ENTER to submit a tag. Tag length must be between 3-16 characters."
              />
            )}
          />
          <DialogActions>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <LoadingButton
                variant="contained"
                loading={createCommunityLoading}
                disabled={
                  title.length < 3 ||
                  title.length > 25 ||
                  description.length > 300 ||
                  rules.length === 0
                }
                onClick={registerCommunity}
              >
                Submit
              </LoadingButton>
              <Button
                variant="contained"
                onClick={props.closeAddCommunityModal}
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

AddCommunityModal.propTypes = {
  createCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  open: state.modal.addCommunity.open,
});

export default connect(mapStateToProps, {
  createCommunity,
  closeAddCommunityModal,
})(AddCommunityModal);
