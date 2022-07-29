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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  Stack,
  TextField,
  DialogActions,
} from "@mui/material";

import { editPost } from "../../redux/ducks/postDuck";
import { closeEditPostModal } from "../../redux/ducks/modalDuck";
import MarkDownEditor from "../MarkDownEditor";

const EditPostModal = (props) => {
  const minTitleLength = 3;
  const maxTitleLength = 200;
  const minMessageLength = 3;
  const maxMessageLength = 40000;

  const [title, setTitle] = useState(props.post.title ?? "");
  const [message, setMessage] = useState(props.post.message ?? "");

  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const setMessageAndSetErrors = (newMessage) => {
    setMessage(newMessage);
    setMessageError(
      newMessage.length < minMessageLength ||
        newMessage.length > maxMessageLength
    );
  };

  const onTitleChange = (event) => {
    setTitle(event.target.value);
    setTitleError(
      event.target.value.length < minTitleLength ||
        event.target.value.length > maxTitleLength
    );
  };

  useEffect(() => {
    setTitle(props.post.title ?? "");
    setMessage(props.post.message ?? "");
    setTitleError(false);
    setMessageError(false);
  }, [props.post]);

  const registerPost = async () => {
    const post = {
      id: props.post._id,
      title: title || props.post.title,
      message: message || props.post.message,
    };

    const successful = await props.editPost(post);
    if (successful === true) {
      props.closeEditPostModal();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeEditPostModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Edit Post</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="edit-post-title">Title</InputLabel>
            <TextField
              id="edit-post-title"
              onChange={onTitleChange}
              value={title}
              error={titleError}
              name="title"
              placeholder="Title"
              helperText={`Title must be ${minTitleLength}-${maxTitleLength} characters in length.`}
              required
              fullWidth
            />
          </Stack>
          <MarkDownEditor
            label="Message"
            error={messageError}
            id="message-input"
            value={message}
            onChange={setMessageAndSetErrors}
          />
          <DialogActions
            sx={{
              m: 0,
              pb: 0,
            }}
          >
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                variant="contained"
                onClick={registerPost}
                disabled={messageError || titleError}
              >
                Edit
              </Button>
              <Button onClick={props.closeEditPostModal} color="button">
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

EditPostModal.propTypes = {};

const mapStateToProps = (state) => ({
  post: state.modal.editPost.post,
  open: state.modal.editPost.open,
});

export default connect(mapStateToProps, { editPost, closeEditPostModal })(
  EditPostModal
);
