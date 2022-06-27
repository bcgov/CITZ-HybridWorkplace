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

import { Grid, Box, Button, Typography } from "@mui/material";
import { getPosts } from "../redux/ducks/postDuck";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import UsersCommunitiesList from "../components/UsersCommunitiesList";
import PostsList from "../components/PostsList";
import PostModal from "../components/modals/AddPostModal";
import AddCommunityModal from "../components/modals/AddCommunityModal";
import AddIcon from "@mui/icons-material/Add";
import { openAddPostModal } from "../redux/ducks/modalDuck";

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
    <Box sx={{ pb: 20 }}>
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
                  <AddIcon sx={{ color: "white" }} />
                </Button>
              </Grid>
            </Grid>

            <PostModal />
          </Box>
          <PostsList posts={props.posts} />
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
                <Button variant="text" onClick={openDialog}>
                  <AddIcon sx={{ color: "white", pl: 2 }} />
                </Button>
                <AddCommunityModal
                  onClose={closeDialog}
                  open={createCommunityOpen}
                />
              </Grid>
            </Grid>
          </Box>
          <UsersCommunitiesList />
        </Grid>
      </Grid>
    </Box>
  );
};

HomePage.propTypes = { posts: PropTypes.array.isRequired };

const mapStateToProps = (state) => ({
  posts: state.posts.items,
});

export default connect(mapStateToProps, { getPosts, openAddPostModal })(
  HomePage
);
