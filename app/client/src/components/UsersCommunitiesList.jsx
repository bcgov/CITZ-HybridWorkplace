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

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { Paper, Box, Grid, Stack, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

import { getUsersCommunities } from "../redux/ducks/communityDuck";
import JoinButton from "./JoinButton";

const UsersCommunitiesList = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    props.getUsersCommunities();
  }, []);

  const handleCommunityClick = (title) => navigate(`/community/${title}`);

  return (
    <Box
      sx={{
        mt: 3,
      }}
    >
      {props.communities.map((community) => (
        <Box key={community._id} sx={{ mb: "15px" }}>
          <Paper
            sx={{
              px: 0.5,
              borderRadius: "10px",
              m: "auto",
              border: 0,
              boxShadow: 1,
            }}
            variant="outlined"
            square
          >
            <Grid container spacing={1} alignItems="center">
              <Grid
                item
                xs={9}
                onClick={() => handleCommunityClick(community.title)}
                sx={{ cursor: "pointer" }}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <Typography p={1.5} variant="h7" component="p">
                      <b>{community.title}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: 0, pb: "10px" }}>
                    <Stack direction="row" spacing={1} sx={{ ml: "15px" }}>
                      <GroupsIcon sx={{ color: "#898989" }} />
                      <Typography color="#898989">
                        {community.memberCount || 0}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}></Grid>
                </Grid>
              </Grid>

              <Grid item xs={3} textAlign="center">
                <JoinButton community={community} />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

UsersCommunitiesList.propTypes = {
  communities: PropTypes.array.isRequired,
  getUsersCommunities: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities.usersCommunities,
});

const mapActionsToProps = {
  getUsersCommunities,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(UsersCommunitiesList);
