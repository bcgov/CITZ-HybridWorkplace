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

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import PostsList from "../components/PostsList";
import PostModal from "../components/modals/AddPostModal";
import { openEditCommunityModal } from "../redux/ducks/modalDuck";
import { getCommunityPosts, getCommunity } from "../redux/ducks/communityDuck";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
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
    <div>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Paper>
            <Box
              sx={{
                backgroundColor: "#036",
                color: "white",
                px: 1,
                py: 0.5,
                textAlign: "center",
                display: "flex",
              }}
            >
              <Typography variant="h6" component="h5">
                Posts
              </Typography>
              <Button onClick={() => setShow(true)}> Add Post </Button>

              <PostModal
                communityName={title}
                onClose={() => setShow(false)}
                show={show}
              />
            </Box>
            <PostsList posts={props.community.posts} />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper>
            <Box
              sx={{
                backgroundColor: "#036",
                color: "white",
                px: 1,
                py: 0.5,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" component="h5">
                {title}
              </Typography>
            </Box>
            <div>
              <p>{props.community.description}</p>
              <br />
            </div>
          </Paper>
          <br />
          {props.community.creator === props.username && (
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
    </div>
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
});

const mapDispatchToProps = {
  getCommunityPosts,
  getCommunity,
  openEditCommunityModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityPage);
