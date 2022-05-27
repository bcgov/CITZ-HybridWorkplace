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
import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import "./addPost.css";

import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

import { getCommunities } from "../../redux/ducks/communityDuck";
import { createPost } from "../../redux/ducks/postDuck";

const CreatePost = (props) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [creator, setCreator] = useState(props.auth.user.name);
  const [community, setCommunity] = useState("");

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

    const successful = await props.createPost(post)
    if (successful === true) {
      setTitle("")
      setMessage("")
      setCommunity("")
      props.onClose()
    }
  };

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const onCommunityClick = (commTitle) => {
    setCommunity(commTitle);
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
            />
            <br />
            <TextField
              onChange={onMessageChange}
              name="message"
              placeholder="Message"
              multiline
              value={message}
            />
            <br />
            <p>Choose a Community:</p>
            {props.communities.map((comm) => (
              <div key={comm._id}>
                {/* TODO: change button input for choosing community to radio  */}
                <Button onClick={() => onCommunityClick(comm.title)} variant={`${comm.title === community ? 'contained' : 'outlined'}`}>
                  {comm.title}{" "}
                </Button>
              </div>
            ))}
            <input type="submit" value="Submit" id="submit" />
          </form>
          <br />
        </Paper>
        <br />
        <br />
      </div>
    </div>
  );
};

CreatePost.propTypes = {
  getCommunities: PropTypes.func.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities.items,
  auth: state.auth
});

export default connect(mapStateToProps, { getCommunities, createPost })(
  CreatePost
);