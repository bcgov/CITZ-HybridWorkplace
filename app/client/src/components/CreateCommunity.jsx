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
import { createCommunity } from "../redux/ducks/communityDuck";
import { Autocomplete, Button, Chip, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const CreateCommunity = (props) => {
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
    <div>
      <form onSubmit={registerCommunity}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
        />
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Description"
        />
        <input
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          type="text"
          placeholder="Rules"
        />
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
            />
          )}
        />
        <br />
        <LoadingButton
          variant="contained"
          loading={createCommunityLoading}
          id="submit"
          onClick={registerCommunity}
        >
          Submit
        </LoadingButton>
      </form>
    </div>
  );
};

CreateCommunity.propTypes = {
  createCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createCommunity })(CreateCommunity);
