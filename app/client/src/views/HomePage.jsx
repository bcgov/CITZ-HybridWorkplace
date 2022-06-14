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

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getPosts } from "../redux/ducks/postDuck";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import UsersCommunitiesList from "../components/UsersCommunitiesList";
import PostsList from "../components/PostsList";
import PostModal from "../components/modals/AddPostModal";
import AddCommunityModal from "../components/modals/AddCommunityModal";

const HomePage = (props) => {
  useEffect(() => {
    props.getPosts();
  }, []);
  const [show, setShow] = useState(false);

  const [createCommunityOpen, setCreateCommunityOpen] = useState(false);

  const openDialog = () => {
    setCreateCommunityOpen(true);
  };

  const closeDialog = (value) => {
    setCreateCommunityOpen(false);
  };

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
                {" "}
                Posts{" "}
              </Typography>
              <Button onClick={() => setShow(true)}> Add Post </Button>

              <PostModal onClose={() => setShow(false)} show={show} />
            </Box>
            <PostsList posts={props.posts} />
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
                Your Communities
              </Typography>
            </Box>
            <UsersCommunitiesList />
            <Box
              sx={{
                backgroundColor: "#036",
                color: "white",
                px: 1,
                py: 0.5,
                textAlign: "center",
              }}
            >
              <Button variant="text" onClick={openDialog}>
                + Create Community
              </Button>
              <AddCommunityModal
                onClose={closeDialog}
                open={createCommunityOpen}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

HomePage.propTypes = {
  getCommunities: PropTypes.func.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  communities: state.communities.items,
  auth: state.auth.accessToken,
  posts: state.posts.items,
});

export default connect(mapStateToProps, { getPosts })(HomePage);
