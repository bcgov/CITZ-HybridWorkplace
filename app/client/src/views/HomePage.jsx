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

import { Grid, Box, Button, Typography, Link, Tooltip } from "@mui/material";
import { getPosts } from "../redux/ducks/postDuck";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import UsersCommunitiesList from "../components/UsersCommunitiesList";
import PostsList from "../components/PostsList";
import PostModal from "../components/modals/AddPostModal";
import AddCommunityModal from "../components/modals/AddCommunityModal";
import AddIcon from "@mui/icons-material/Add";
import {
  openAddPostModal,
  openAddCommunityModal,
} from "../redux/ducks/modalDuck";
import LoadingPage from "./LoadingPage";
import ResolveFlagsModal from "../components/modals/ResolveFlagsModal";
import Croutons from "../components/Croutons";

const HomePage = (props) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await props.getPosts();
      setLoading(false);
    })();
  }, []);

  return loading ? (
    <LoadingPage />
  ) : (
    <Box sx={{ pb: 20 }}>
      <Croutons />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box
            mb="15px"
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "10px",
              color: "white",
              px: 1,
              py: 0.5,
              textAlign: "center",
              display: "flex",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={9}>
                <Typography
                  variant="h5"
                  component="h5"
                  sx={{
                    fontWeight: 600,
                    pl: "9em",
                  }}
                >
                  Top Posts
                </Typography>
              </Grid>
              <Grid item xs={3} align="right">
                <Button onClick={() => props.openAddPostModal()}>
                  <Tooltip title={<Typography>Add New Post</Typography>}>
                    <AddIcon sx={{ color: "white", pl: 4 }} />
                  </Tooltip>
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ backgroundColor: "backgroundSecondary.main", padding: 1.25, borderRadius: "7.5px"}}>
            {props.posts.length > 0 ? (
              <PostsList posts={props.posts} />
            ) : (
              <Box sx={{ mt: 5, mb: 5 }}>
                <Typography
                  variant="h5"
                  textAlign="center"
                  sx={{ fontWeight: 600, pb: 3 }}
                >
                  No posts to display.
                </Typography>
                <Typography
                  variant="h6"
                  textAlign="center"
                  sx={{ fontWeight: 600 }}
                >
                  Press the "+" icon to create a post in a community you are a
                  member of.
                </Typography>
                <Typography
                  variant="h6"
                  textAlign="center"
                  sx={{ fontWeight: 600 }}
                >
                  <Link href="/communities">
                    Click here to see communities you can join.
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            mb="15px"
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "10px",
              color: "white",
              px: 1,
              py: 0.5,
              textAlign: "center",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={9}>
                <Typography
                  variant="h6"
                  component="h5"
                  sx={{
                    fontWeight: 600,
                    pl: "5.25em",
                    pt: 0.3,
                  }}
                >
                  My Communities
                </Typography>
              </Grid>
              <Grid item xs={3} align="right">
                <Button
                  variant="text"
                  onClick={() => props.openAddCommunityModal()}
                >
                  <Tooltip title={<Typography>Add New Community</Typography>}>
                    <AddIcon sx={{ color: "white", pl: 4 }} />
                  </Tooltip>
                </Button>
              </Grid>
            </Grid>
          </Box>
          <UsersCommunitiesList />
        </Grid>
      </Grid>
      <AddCommunityModal />
      <PostModal />
      <ResolveFlagsModal />
    </Box>
  );
};

HomePage.propTypes = { posts: PropTypes.array.isRequired };

const mapStateToProps = (state) => ({
  posts: state.posts.items,
});

export default connect(mapStateToProps, {
  getPosts,
  openAddPostModal,
  openAddCommunityModal,
})(HomePage);
