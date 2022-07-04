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
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import DeleteCommunityModal from "./modals/DeleteCommunityModal";
import Community from "./Community";
import { Box } from "@mui/material";

import {
  getCommunities,
  getUsersCommunities,
} from "../redux/ducks/communityDuck";

const CommunitiesList = (props) => {
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const hideJoined = useQuery().get("hideJoined") === "true";

  useEffect(() => {
    props.getUsersCommunities();
    props.getCommunities();
  }, []);

  const communities = hideJoined
    ? props.communities.filter(
        (community) => !community.members.includes(props.userId)
      )
    : props.communities;

  return (
    <Box>
      {communities.map((community) => (
        <Community community={community} key={community.title} />
      ))}
      <DeleteCommunityModal />
    </Box>
  );
};

CommunitiesList.propTypes = {
  userId: PropTypes.string.isRequired,
  getCommunities: PropTypes.func.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities.items,
  userId: state.auth.user.id,
});

export default connect(mapStateToProps, {
  getCommunities,
  getUsersCommunities,
})(CommunitiesList);
