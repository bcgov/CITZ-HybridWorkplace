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

import {
  Paper,
  Box,
  Grid,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import FeedIcon from "@mui/icons-material/Feed";

import { getUsersCommunities } from "../redux/ducks/communityDuck";
import JoinButton from "./JoinButton";

const UsersCommunitiesList = (props) => {
  const navigate = useNavigate();
  const maxDisplayedTitleLength = 65;

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
        <Paper
          key={community._id}
          sx={{
            px: 0.5,
            borderRadius: "10px",
            m: "auto",
            mb: "15px",
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
                    <b>
                      {community.title.length >= maxDisplayedTitleLength
                        ? community.title.substring(
                            0,
                            maxDisplayedTitleLength
                          ) + "..."
                        : community.title}
                    </b>
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ pt: 0, pb: "10px" }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ ml: "15px", alignItems: "center" }}
                  >
                    <Tooltip
                      title={<Typography>Community Members</Typography>}
                      arrow
                    >
                      <GroupsIcon sx={{ color: "#898989" }} />
                    </Tooltip>
                    <Typography color="#898989">
                      {community.memberCount || 0}
                    </Typography>
                    <Tooltip
                      title={<Typography>Community Posts</Typography>}
                      arrow
                    >
                      <IconButton disableRipple sx={{ pr: 0 }}>
                        <FeedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Typography color="#898989">
                      {community.postCount || 0}
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
      ))}
    </Box>
  );
};

UsersCommunitiesList.propTypes = {
  communities: PropTypes.array.isRequired,
  getUsersCommunities: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities.communities
    .filter((comm) => comm.userIsInCommunity)
    .sort((a, b) => {
      if (a.engagement < b.engagement) {
        return -1;
      }
      if (a.engagement > b.engagement) {
        return 1;
      }
      return 0;
    }),
});

const mapActionsToProps = {
  getUsersCommunities,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(UsersCommunitiesList);
