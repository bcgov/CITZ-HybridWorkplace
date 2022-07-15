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
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  Typography,
  Button,
  Stack,
  Box,
  InputLabel,
  DialogActions,
} from "@mui/material";

import { getCommunities } from "../../redux/ducks/communityDuck";
import { createPost } from "../../redux/ducks/postDuck";
import { closeAddPostModal } from "../../redux/ducks/modalDuck";
import MarkDownEditor from "../MarkDownEditor";

const AddPostModal = (props) => {
  // TODO: Grab length options from API
  const minTitleLength = 3;
  const maxTitleLength = 50;
  const minMessageLength = 3;
  const maxMessageLength = 40000;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const setMessageAndSetErrors = (newMessage) => {
    setMessage(newMessage);
    setMessageError(
      newMessage.length < minMessageLength ||
        newMessage.length > maxMessageLength
    );
  };

  const [creator, setCreator] = useState(props.auth.user.username);
  const [community, setCommunity] = useState(props.communityName || "");

  useEffect(() => {
    props.getCommunities();
  }, []);

  const registerPost = async (event) => {
    event.preventDefault();
    const post = {
      title: title,
      message: message,
      creator: creator,
      community: community,
    };

    const successful = await props.createPost(post);
    if (successful === true) {
      props.closeAddPostModal();
      resetInput();
    }
  };

  const resetInput = () => {
    setTitle("");
    setMessage("");
    setCommunity(props.communityName ?? "");
    setTitleError(false);
    setMessageError(false);
  };

  const onTitleChange = (event) => {
    setTitle(event.target.value);
    setTitleError(
      event.target.value.length < minTitleLength ||
        event.target.value.length > maxTitleLength
    );
  };

  const handleCommunityChange = (event) => {
    setCommunity(event.target.value);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeAddPostModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Add Post</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="add-post-title" error={titleError}>
              Title
            </InputLabel>
            <TextField
              id="add-post-title"
              onChange={onTitleChange}
              name="title"
              placeholder="Title"
              value={title}
              error={titleError}
              helperText="Title must be 3-50 characters in length."
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
          {!props.communityName && (
            <Box>
              <InputLabel>Choose a Community:</InputLabel>
              <Select
                value={community}
                onChange={handleCommunityChange}
                sx={{ mb: 1.5, minWidth: "15em", width: "98%" }}
              >
                {props.communities.map((comm, index) => (
                  <MenuItem value={comm.title} key={comm.title + index}>
                    {comm.title}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
          <DialogActions
            sx={{
              m: 0,
              pb: 0,
            }}
          >
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                variant="contained"
                disabled={
                  titleError ||
                  messageError ||
                  !community ||
                  title === "" ||
                  message === ""
                }
                onClick={registerPost}
              >
                Post
              </Button>
              <Button onClick={props.closeAddPostModal}>Cancel</Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

AddPostModal.propTypes = {
  getCommunities: PropTypes.func.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities.communities.filter(
    (comm) => comm.userIsInCommunity
  ),
  auth: state.auth,
  open: state.modal.addPost.open,
});

export default connect(mapStateToProps, {
  getCommunities,
  createPost,
  closeAddPostModal,
})(AddPostModal);
