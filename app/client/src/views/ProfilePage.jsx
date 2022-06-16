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
 * @author [Brandon Bouchard](brandonjbouchard@gmail.com)
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @module
 */

import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./Styles/profile.css";
import { getProfile } from "../redux/ducks/profileDuck";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  Typography,
  Avatar,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  Stack,
  Divider,
  Switch,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

import ProfileInfo from "../components/ProfileInfo";

const ProfilePage = (props) => {
  let { username } = useParams();

  useEffect(() => {
    props.getProfile(username);
  }, []);

  return (
    <Box
      sx={{
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
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
              <Avatar
                sx={{ width: 150, height: 150 }}
                src="https://source.unsplash.com/random/150×150/?profile%20picture"
              />
              <br />
              <Grid item xs={12}>
                <ProfileInfo username={username} />
              </Grid>
              <br />
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: "left",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 600, color: "#313132" }}
                  >
                    Interests
                  </Typography>
                  <Stack direction="column" spacing={1}>
                    <Stack direction="row" spacing={1}>
                      <Chip label="DevOps" color="primary" />
                      <Chip label="Design" color="error" />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Frontend Development" color="secondary" />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Project Management" color="success" />
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3}>
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
              <br />
              <Grid container spacing={2}>
                {props.communities.slice(0, 4).map((element) => (
                  <Grid item xs={6} key={element._id}>
                    <Box
                      sx={{
                        backgroundColor: "#FFF",
                        boxShadow: 1,
                        borderRadius: "10px",
                        color: "#313132",
                        py: 1,
                        px: 2,
                        textAlign: "start",
                        height: "auto",
                      }}
                    >
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        {element.title}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <GroupsIcon fontSize="small" />
                        <Typography
                          variant="p"
                          style={{
                            color: "#999",
                            paddingLeft: "0.5em",
                          }}
                        >
                          {element.members.length}
                        </Typography>
                      </Stack>
                      <br />
                      <Stack direction="row" spacing={2}>
                        <Typography
                          variant="p"
                          style={{ fontWeight: 600, color: "#313132" }}
                        >
                          Joined:
                        </Typography>
                        <Typography
                          variant="p"
                          style={{
                            fontWeight: 600,
                            color: "#999",
                          }}
                        >
                          2023/01/01
                        </Typography>
                      </Stack>
                      <br />
                      <Stack direction="row" spacing={2}>
                        <Typography
                          variant="p"
                          style={{ fontWeight: 600, color: "#313132" }}
                        >
                          Latest Activity:
                        </Typography>
                        <Typography
                          variant="p"
                          style={{
                            fontWeight: 600,
                            color: "#999",
                            textAlign: "left",
                          }}
                        >
                          Today 10:36AM
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h4" style={{ fontWeight: 600 }}>
            Settings
          </Typography>
          <br />
          <Box
            sx={{
              color: "#313132",
              boxShadow: 2,
              py: 1,
              px: 2,
              borderRadius: "10px",
            }}
          >
            <FormControl>
              <FormLabel id="notification-frequency-radios-label">
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
              </FormLabel>
              <Divider />
              <RadioGroup
                aria-labelledby="notification-frequency-radios-label"
                defaultValue="immediately"
                name="notification-frequency-radios-group"
              >
                <FormControlLabel
                  value="none"
                  control={<Radio size="small" />}
                  label="None"
                />
                <FormControlLabel
                  value="immediately"
                  control={<Radio size="small" />}
                  label="Immediately"
                />
                <FormControlLabel
                  value="daily"
                  control={<Radio size="small" />}
                  label="Daily"
                />
                <FormControlLabel
                  disabled
                  value="weekly"
                  control={<Radio size="small" />}
                  label="Weekly"
                />
                <FormControlLabel
                  disabled
                  value="monthly"
                  control={<Radio size="small" />}
                  label="Monthly"
                />
              </RadioGroup>
            </FormControl>
            <Divider />
            <br />
            <Stack direction="row" spacing={1}>
              <Typography variant="p" style={{ fontWeight: 600 }}>
                Dark Mode
              </Typography>
              <Switch />
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={8}>
          <Typography variant="h4" style={{ fontWeight: 600 }}>
            Recent Posts
          </Typography>
          <br />
          <Stack direction="row" spacing={2}>
            {props.communities.slice(0, 4).map((element) => (
              <Box
                sx={{
                  borderRadius: "10px",
                  py: 1,
                  pr: 4,
                  width: "600px",
                  m: 0,
                }}
                key={element._id}
              >
                <Box
                  sx={{
                    backgroundColor: "#003366",
                    width: "600px",
                    py: 1,
                    px: 2,
                    borderRadius: "10px",
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{ fontWeight: 600, color: "#FFF" }}
                  >
                    {element.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{ fontWeight: 600, color: "#FFF" }}
                  >
                    by {element.creator}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

ProfilePage.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  communities: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.user,
  communities: state.communities.usersCommunities,
});

const mapActionsToProps = { getProfile };

export default connect(mapStateToProps, mapActionsToProps)(ProfilePage);
