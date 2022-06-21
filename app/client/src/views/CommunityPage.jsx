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

import React, { useState, useEffect } from "react";

import { Grid, Paper, Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";

import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import PostsList from "../components/PostsList";
import PostModal from "../components/modals/AddPostModal";
import { openEditCommunityModal } from "../redux/ducks/modalDuck";
import { getCommunityPosts, getCommunity } from "../redux/ducks/communityDuck";
import EditCommunityModal from "../components/modals/EditCommunityModal";

const CommunityPage = (props) => {
  const [show, setShow] = useState(false);

  const { title } = useParams();

  useEffect(() => {
    props.getCommunityPosts(title);
    props.getCommunity(title);
  }, []);

  const handleSettingsClick = () =>
    props.openEditCommunityModal(props.community);
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box
            mb="15px"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              px: 1,
              py: 0.5,
              textAlign: "center",
              display: "flex",
              borderRadius: "10px",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={9}>
                <Typography
                  variant="h5"
                  component="h5"
                  sx={{
                    pl: "8em",
                    fontWeight: 600,
                  }}
                >
                  Community Posts
                </Typography>
              </Grid>
              <Grid item xs={3} align="right">
                <Button onClick={() => setShow(true)}>
                  <Typography color="white">New</Typography>
                  <AddIcon sx={{ color: "white" }} />
                </Button>
              </Grid>
            </Grid>

            <PostModal
              communityName={title}
              onClose={() => setShow(false)}
              show={show}
            />
          </Box>
          <PostsList posts={props.community.posts} />
        </Grid>
        <Grid item align="center" xs={4}>
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "10px",
              color: "white",
              px: 1,
              py: 0.5,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              component="h5"
              sx={{
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ borderRadius: "10px", px: 1, py: 0.5, mb: 1 }}>
            <Typography sx={{ my: "10px" }}>
              {props.community.description}
            </Typography>
          </Box>
          {props.community.creator === props.userId && (
            <Button
              variant="text"
              color="inherit"
              onClick={handleSettingsClick}
            >
              <SettingsTwoToneIcon />
              Settings
            </Button>
          )}
        </Grid>
      </Grid>
      <EditCommunityModal />
    </Box>
  );
};

CommunityPage.propTypes = {
  getCommunityPosts: PropTypes.func.isRequired,
  getCommunity: PropTypes.func.isRequired,
  community: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  community: state.communities.item,
  username: state.auth.user.username,
  userId: state.auth.user.id,
});

const mapDispatchToProps = {
  getCommunityPosts,
  getCommunity,
  openEditCommunityModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityPage);
