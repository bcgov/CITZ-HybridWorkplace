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
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
 * @module
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {
  getUsersCommunities,
  leaveCommunity,
  joinCommunity,
} from "../redux/ducks/communityDuck";
import JoinButton from "./joinButton";
import { Button } from "@mui/material";

const JoinCommunitiesList = (props) => {
  const [isInCommunity, setIsInCommunity] = useState(true);

  useEffect(() => {
    props.getUsersCommunities();
  }, []);

  const handleLeave = async (community) => {
    setIsInCommunity(false);
    const success = await props.leaveCommunity(community);
  };

  const handleJoin = async (community) => {
    setIsInCommunity(true);
    const success = await props.joinCommunity(community);
  };

  return (
    <div>
      {props.communities.usersCommunities.map((community) => (
        <div key={community._id}>
          <Paper
            sx={{
              px: 0.5,
              margin: "auto",
            }}
            variant="outlined"
            square
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={9}>
                <Typography p={1.5} variant="p" component="p">
                  {community.title}
                </Typography>
              </Grid>

              <Grid item xs={3} textAlign="center">
                <JoinButton community={community} />
              </Grid>
            </Grid>
          </Paper>
        </div>
      ))}
    </div>
  );
};

JoinCommunitiesList.propTypes = {
  getCommunities: PropTypes.func.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities,
});

const mapActionsToProps = {
  getUsersCommunities,
  leaveCommunity,
  joinCommunity,
};

export default connect(mapStateToProps, mapActionsToProps)(JoinCommunitiesList);
