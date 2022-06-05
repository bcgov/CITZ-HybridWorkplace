//
// Copyright Â© 2022 Province of British Columbia
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

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import "./Styles/profile.css";
import { getProfile } from "../redux/ducks/profileDuck";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Grid, Paper, Box, Typography, Avatar, Form } from "@mui/material";

import UsersCommunitiesList from "../components/UsersCommunitiesList";
import ProfileInfo from "../components/ProfileInfo";

const ProfilePage = (props) => {
  let { username } = useParams();

  useEffect(() => {
    props.getProfile(username);
  }, []);

  return (
    <Box sx={{ alignItems: "stretch" }}>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="space-around"
        alignItems="flex-start"
      >
        <Grid item xs={2}>
          <Grid
            container
            direction="column"
            alignitems="flex-start"
            justifyContent="space-evenly"
          >
            <Grid item xs={12}>
              <Avatar src="https://source.unsplash.com/random/150×150/?profile" />
              <ProfileInfo />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container direction="row" justifyContent="space-evenly">
            <Grid item xs={12}>
              <Typography variant="h4" style={{ fontWeight: 600 }}>
                Bio
              </Typography>
              <br />
              <Typography variant="body1">
                {props.profile.bio || "No bio to display"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container direction="row" justifyContent="space-evenly">
            <Grid item xs={12}>
              <Typography variant="h4" style={{ fontWeight: 600 }}>
                Pinned Communities
              </Typography>
              <Grid container spacing={2}>
                {props.communities.slice(0, 4).map((element) => (
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        backgroundColor: "#036",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        textAlign: "center",
                      }}
                    >
                      <p>{element.title}</p>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}></Grid>
        <Typography variant="h4" style={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <Box
          sx={{
            backgroundColor: "#036",
            color: "white",
            px: 1,
            py: 0.5,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="p">
            Community
          </Typography>
        </Box>
        <Grid item xs={8}>
          <Typography variant="h4" style={{ fontWeight: 600 }}>
            Recent Posts
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

ProfilePage.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.user,
  communities: state.communities.items,
});

const mapActionsToProps = { getProfile };

export default connect(mapStateToProps, mapActionsToProps)(ProfilePage);
