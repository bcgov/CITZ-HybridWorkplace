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
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createCommunity } from "../redux/ducks/communityDuck";
import { Button } from "@mui/material";

const CreateCommunity = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [createCommunityLoading, setCreateCommunityLoading] = useState(false);

  async function registerCommunity() {
    setCreateCommunityLoading(true);
    const community = {
      title: title,
      description: description,
      rules: rules,
    };
    const successful = await props.createCommunity(community);
    setCreateCommunityLoading(false);
    if (successful === true) {
      navigate("/home");
    }
  }

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
        <br />
        <Button
          variant="contained"
          loading={createCommunityLoading}
          id="submit"
          onClick={registerCommunity}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

CreateCommunity.propTypes = {
  createCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createCommunity })(CreateCommunity);
