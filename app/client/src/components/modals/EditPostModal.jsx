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
  Card,
  CardContent,
  CardHeader,
  Dialog,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import "./addPost.css";

import { editPost } from "../../redux/ducks/postDuck";
import { closeEditPostModal } from "../../redux/ducks/modalDuck";
import MDEditor from "@uiw/react-md-editor";

const EditPostModal = (props) => {
  const minTitleLength = 3;
  const maxTitleLength = 50;
  const minMessageLength = 3;
  const maxMessageLength = 40000;

  const [title, setTitle] = useState(props.post.title);
  const [message, setMessage] = useState(props.post.message);

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
    setTitle(props.post.title);
    setMessage(props.post.message);
    setTitleError(false);
    setMessageError(false);
  }, [props.post]);

  const registerPost = async () => {
    const post = {
      id: props.post._id,
      title: title || props.post.title,
      message: message || props.post.message,
      pinned: props.post.pinned,
    };

    const successful = await props.editPost(post);
    if (successful === true) {
      props.closeEditPostModal();
    }
  };

  return (
    <Dialog
      onClose={props.closeEditPostModal}
      open={props.open}
      fullWidth
      sx={{ zIndex: 500 }}
    >
      <Card>
        <CardHeader title="Edit Post" />
        <CardContent>
          <Stack spacing={2} data-color-mode="light">
            <TextField
              id="title-input"
              onChange={onTitleChange}
              placeholder="Title"
              value={title}
              size="small"
              error={titleError}
              label="Title"
              helperText="Title must be 3-50 characters in length."
              required
            />
            <br />

            <Box>
              <Stack
                spacing={1.5}
                sx={{
                  border: 3,
                  borderColor: messageError ? "red" : "transparent",
                  padding: 1,
                  color: messageError ? "red" : "-moz-initial",
                }}
              >
                <InputLabel
                  htmlFor="message-input"
                  sx={{
                    color: messageError ? "red" : "-moz-initial",
                  }}
                >
                  Message
                </InputLabel>
                <MDEditor
                  id="message-input"
                  data-color-mode="light"
                  value={message}
                  onChange={setMessageAndSetErrors}
                />
              </Stack>
            </Box>

            <Button
              variant="contained"
              disabled={messageError || titleError}
              onClick={registerPost}
            >
              Edit Post
            </Button>
          </Stack>
        </CardContent>

        <br />
      </Card>
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
