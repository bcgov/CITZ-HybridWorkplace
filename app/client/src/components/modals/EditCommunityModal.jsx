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
} from "@mui/material";
import { closeEditCommunityModal } from "../../redux/ducks/modalDuck";
import { createError } from "../../redux/ducks/alertDuck";
import { editCommunity } from "../../redux/ducks/communityDuck";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import MarkDownEditor from "../MarkDownEditor";
import InputRuleList from "../InputRuleList";

const EditCommunityModal = (props) => {
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
    if (!changes) return;

    const successful = await props.editCommunity(
      props.community.title,
      changes
    );
    if (successful) {
      // To be uncommented when backend supports community title change
      //navigate(`/community/${newComm.title || props.community.title}`);
      document.location.reload();
    }
  };

  return (
    <Dialog
      onClose={props.closeEditCommunityModal}
      open={props.open}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 500, mb: 5 }}
    >
      <DialogTitle fontWeight={600}>Edit Community</DialogTitle>
      <DialogContent sx={{ pt: 5 }}>
        <Stack spacing={2}>
          <InputLabel htmlFor="community-title-input">Title</InputLabel>
          <TextField
            id="community-title-input"
            sx={{ mt: 1 }}
            onChange={onTitleChange}
            placeholder="Title"
            value={title}
            size="small"
            error={
              !title ||
              (title === "" || (title.length >= 3 && title.length <= 25)
                ? false
                : true)
            }
            helperText="Title must be 3-25 characters in length."
            required
          />
          <MarkDownEditor
            label="Description"
            error={
              !description ||
              (description === "" ||
              (description.length >= 3 && description.length <= 300)
                ? false
                : true)
            }
            id="description-input"
            value={description}
            onChange={setDescription}
          />
          <InputLabel htmlFor="community-rules-input">Rules</InputLabel>
          <InputRuleList rules={rules} setRules={setRules} />
          <DialogActions sx={{ m: 0, pb: 0 }}>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                variant="contained"
                disabled={
                  title &&
                  description &&
                  (title.length < 3 ||
                    title.length > 25 ||
                    description.length < 3 ||
                    description.length > 300)
                }
                onClick={onSubmit}
              >
                Edit Community
              </Button>
              <Button
                variant="contained"
                onClick={props.closeEditCommunityModal}
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
