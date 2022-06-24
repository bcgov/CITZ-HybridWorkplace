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
import "./addPost.css";

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
  Avatar,
  Box,
  InputLabel,
} from "@mui/material";

import { getCommunities } from "../../redux/ducks/communityDuck";
import { createPost } from "../../redux/ducks/postDuck";
import { closeAddPostModal } from "../../redux/ducks/modalDuck";
import MDEditor from "@uiw/react-md-editor";

const AddPostModal = (props) => {
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
      setTitle("");
      setMessage("");
      setCommunity("");
      props.closeAddPostModal();
    }
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
      sx={{ zIndex: 500 }}
      fullWidth
    >
      <DialogTitle>
        <Typography sx={{ fontWeight: "bold" }}>Add Post</Typography>
      </DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack>
          <Stack container spacing={1.5} direction="row">
            <Avatar src="https://source.unsplash.com/random/150×150/?profile%20picture" />
            <TextField
              sx={{ ml: 1 }}
              onChange={onTitleChange}
              name="title"
              placeholder="Title"
              value={title}
              error={
                title === "" || (title.length >= 3 && title.length <= 50)
                  ? false
                  : true
              }
              helperText="Title must be 3-50 characters in length."
              required
              fullWidth
            />
          </Stack>
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
                value={message}
                onChange={setMessageAndSetErrors}
              />
            </Stack>
          </Box>
          {!props.communityName && (
            <>
              <Typography sx={{ ml: 1 }}>Choose a Community:</Typography>
              <Select
                value={community}
                onChange={handleCommunityChange}
                sx={{ m: 1, minWidth: "15em" }}
              >
                {props.communities.map((comm) => (
                  <MenuItem value={comm.title}>{comm.title}</MenuItem>
                ))}
              </Select>
            </>
          )}
          <br />
          <Button
            sx={{ ml: 1 }}
            variant="contained"
            disabled={
              title.length < 3 ||
              title.length > 50 ||
              message.length < 3 ||
              message.length > 40000 ||
              !community
            }
            onClick={registerPost}
          >
            Submit
          </Button>
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
  communities: state.communities.usersCommunities,
  auth: state.auth,
  open: state.modal.addPost.open,
});

export default connect(mapStateToProps, {
  getCommunities,
  createPost,
  closeAddPostModal,
})(AddPostModal);
