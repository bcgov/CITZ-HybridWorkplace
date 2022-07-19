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
import { closeEditCommunityModal } from "../../redux/ducks/modalDuck";
import { createError } from "../../redux/ducks/alertDuck";
import { editCommunity } from "../../redux/ducks/communityDuck";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditCommunityModal = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(props.community.title);
  const [description, setDescription] = useState(props.community.description);
  const [rules, setRules] = useState(props.community.rules);

  useEffect(() => {
    setTitle(props.community.title ?? "");
  }, [props.community.title]);

  useEffect(() => {
    setDescription(props.community.description ?? "");
  }, [props.community.description]);

  useEffect(() => {
    setRules(props.community.rules ?? "");
  }, [props.community.rules]);

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onRulesChange = (e) => {
    setRules(e.target.value);
  };

  const makeChangesObject = (commTitle, commDescription, commRules) => {
    const newComm = {};
    if (commTitle !== props.community.title) {
      newComm.title = commTitle;
    }
    if (commDescription !== props.community.description) {
      newComm.description = commDescription;
    }
    if (commRules !== props.community.rules) {
      newComm.rules = commRules;
    }
    return Object.keys(newComm).length === 0
      ? null
      : { ...newComm, oldTitle: props.community.title };
  };

  const onSubmit = async () => {
    const changes = makeChangesObject(title, description, rules);
    if (!changes) {
      props.createError("Modifying a community requires at least one change.");
      return;
    }
    const successful = await props.editCommunity(changes);
    if (successful) {
      navigate(`/community/${changes.title || changes.oldTitle}`);
      document.location.reload();
    }
  };

  return (
    <Dialog
      onClose={props.closeEditCommunityModal}
      open={props.open}
      fullWidth
      sx={{ zIndex: 500, mb: 5 }}
    >
      <DialogTitle fontWeight={600}>Edit Community</DialogTitle>
      <DialogContent sx={{ pt: 5 }}>
        <Stack spacing={3}>
          <InputLabel htmlFor="community-title-input">Title</InputLabel>
          <TextField
            id="community-title-input"
            sx={{ mt: 1 }}
            onChange={onTitleChange}
            placeholder="Title"
            value={title}
            size="small"
            error={
              title &&
              (title === "" || (title.length >= 3 && title.length <= 25))
                ? false
                : true
            }
            helperText="Title must be 3-25 characters in length."
            required
          />
          <InputLabel htmlFor="community-description-input">Title</InputLabel>
          <TextField
            id="community-description-input"
            onChange={onDescriptionChange}
            name="description"
            placeholder="Description"
            multiline
            value={description}
            size="small"
            minRows={4}
            error={
              description &&
              description.length >= 0 &&
              description.length <= 300
                ? false
                : true
            }
            helperText="Description must be between 1-300 characters in length."
          />
          <InputLabel htmlFor="community-rules-input">Title</InputLabel>
          <TextField
            id="community-rules-input"
            onChange={onRulesChange}
            name="rules"
            placeholder="Rules"
            multiline
            value={rules?.toString() /*TODO: Fix rules editing */}
            label="Rules"
            size="small"
            minRows={4}
            error={false}
            helperText="Rules is required."
            required
          />
          <DialogActions sx={{ m: 0, pb: 0 }}>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                variant="contained"
                disabled={
                  (title &&
                    description &&
                    rules &&
                    (title.length < 3 ||
                      title.length > 25 ||
                      description.length > 300)) ||
                  !rules
                }
                onClick={onSubmit}
              >
                Edit
              </Button>
              <Button onClick={props.closeEditCommunityModal} color="button">Cancel</Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  open: state.modal.editCommunity.open,
  community: state.modal.editCommunity.community,
});

const mapActionsToProps = {
  closeEditCommunityModal,
  editCommunity,
  createError,
};

export default connect(mapStateToProps, mapActionsToProps)(EditCommunityModal);
