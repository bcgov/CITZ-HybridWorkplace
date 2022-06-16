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
import AddIcon from "@mui/icons-material/Add";

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
          <Box
            mb="15px"
            sx={{
              backgroundColor: "#036",
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
                <Typography variant="h5" component="h5" pl="175px">
                  <b>Top Posts</b>
                </Typography>
              </Grid>
              <Grid item xs={3} align="right">
                <Button onClick={() => setShow(true)}>
                  <Typography color="white">New</Typography>
                  <AddIcon sx={{ color: "white" }} />
                </Button>
              </Grid>
            </Grid>

            <PostModal onClose={() => setShow(false)} show={show} />
          </Box>
          <PostsList posts={props.posts} />
        </Grid>
        <Grid item xs={4}>
          <Paper>
            <Box
              mb="15px"
              sx={{
                backgroundColor: "#036",
                borderRadius: "10px",
                color: "white",
                px: 1,
                py: 0.5,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" component="h5">
                <b>Your Communities</b>
              </Typography>
            </Box>
            <UsersCommunitiesList />
            <Box
              sx={{
                backgroundColor: "#036",
                borderRadius: "10px",
                color: "white",
                px: 1,
                py: 0.5,
                textAlign: "center",
              }}
            >
              <Button variant="text" onClick={openDialog}>
                <Typography color="white">
                  <b>Create Community</b>
                </Typography>
                <AddIcon sx={{ color: "white" }} />
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

HomePage.propTypes = { posts: PropTypes.array.isRequired };

const mapStateToProps = (state) => ({
  posts: state.posts.items,
});

export default connect(mapStateToProps, { getPosts })(HomePage);
