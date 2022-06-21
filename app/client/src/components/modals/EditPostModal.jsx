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
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Stack,
  TextField,
} from "@mui/material";
import "./addPost.css";

import { editPost } from "../../redux/ducks/postDuck";
import { closeEditPostModal } from "../../redux/ducks/modalDuck";

const EditPostModal = (props) => {
  const [title, setTitle] = useState(props.post.title);
  const [message, setMessage] = useState(props.post.message);

  useEffect(() => {
    setTitle(props.post.title);
    setMessage(props.post.message);
  }, [props.post]);
  const registerPost = async (event) => {
    event.preventDefault();
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

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };
  return (
    <Dialog onClose={props.closeEditPostModal} open={props.open} fullWidth>
      <Card>
        <CardHeader title="Edit Post" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              onChange={onTitleChange}
              placeholder="Title"
              value={title}
              label="Title"
              size="small"
              error={
                title &&
                (title === "" || (title.length >= 3 && title.length <= 50))
                  ? false
                  : true
              }
              helperText="Title must be 3-50 characters in length."
              required
            />
            <br />
            <TextField
              onChange={onMessageChange}
              name="message"
              placeholder="Message"
              multiline
              value={message}
              label="Message"
              size="small"
              minRows={4}
              error={
                message &&
                (message === "" ||
                  (message.length >= 3 && message.length <= 40000))
                  ? false
                  : true
              }
              helperText="Message must be 3-40,000 characters in length."
              required
            />
            {title &&
            message &&
            (title.length < 3 ||
              title.length > 50 ||
              message.length < 3 ||
              message.length > 40000) ? (
              <Button disabled id="submit" onClick={registerPost}>
                Edit Post
              </Button>
            ) : (
              <Button id="submit" onClick={registerPost}>
                Edit Post
              </Button>
            )}
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
