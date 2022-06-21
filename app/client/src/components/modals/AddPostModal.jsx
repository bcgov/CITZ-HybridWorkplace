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
  Paper,
  Select,
  Typography,
  Button,
} from "@mui/material";

import { getCommunities } from "../../redux/ducks/communityDuck";
import { createPost } from "../../redux/ducks/postDuck";

const AddPostModal = (props) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

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
      props.onClose();
    }
  };

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleCommunityChange = (event) => {
    setCommunity(event.target.value);
  };

  return (
    <div
      className={`modal ${props.show ? "show" : ""}`}
      onClick={props.onClose}
    >
      <div className="modalWrap" onClick={(e) => e.stopPropagation()}>
        <Paper>
          <br />
          <h1>Add Post</h1>
          <form onSubmit={registerPost}>
            <TextField
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
            />
            <TextField
              onChange={onMessageChange}
              name="message"
              placeholder="Message"
              multiline
              rows={6}
              maxRows={6}
              value={message}
              error={
                message === "" ||
                (message.length >= 3 && message.length <= 40000)
                  ? false
                  : true
              }
              helperText="Message must be 3-40,000 characters in length."
              required
              sx={{ m: 1, width: 0.8 }}
            />
            {!props.communityName && (
              <>
                <Typography>Choose a Community:</Typography>
                <Select
                  label="Community"
                  onChange={handleCommunityChange}
                  sx={{ m: 1, width: "15em" }}
                >
                  {props.communities.map((comm) => (
                    <MenuItem value={comm.title}>{comm.title}</MenuItem>
                  ))}
                </Select>
              </>
            )}
            <br />
            {title.length < 3 ||
            title.length > 50 ||
            message.length < 3 ||
            message.length > 40000 ||
            !community ? (
              <Button
                variant="contained"
                id="submit"
                disabled
                onClick={registerPost}
              >
                Submit
              </Button>
            ) : (
              <Button variant="contained" id="submit" onClick={registerPost}>
                Submit
              </Button>
            )}
          </form>
          <br />
        </Paper>
        <br />
        <br />
      </div>
    </div>
  );
};

AddPostModal.propTypes = {
  getCommunities: PropTypes.func.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities.usersCommunities,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCommunities, createPost })(
  AddPostModal
);
