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
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import "./Styles/profile.css";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../redux/ducks/profileDuck";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";

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
  const maxCommunityTitleLength = 12;

  useEffect(() => {
    props.getProfile(username);
  }, []);

  const convertDate = (date) => {
    const today = moment().format("MMMM Do YYYY");
    const yesterday = moment().subtract(1, "days").format("MMMM Do YYYY");

    // Convert to local time
    let convertedDate =
      moment(moment.utc(date, "MMMM Do YYYY, h:mm:ss a").toDate())
        .local()
        .format("MMMM Do YYYY, h:mm:ss a") || "";
    // Remove milliseconds
    convertedDate = `${convertedDate.substring(
      0,
      convertedDate.length - 6
    )} ${convertedDate.substring(
      convertedDate.length - 2,
      convertedDate.length
    )}`;
    const splitDate = convertedDate.split(",");

    if (splitDate[0] === today) convertedDate = `Today,${splitDate[1]}`;
    if (splitDate[0] === yesterday) convertedDate = `Yesterday,${splitDate[1]}`;

    return convertedDate;
  };

  return (
    <Box
      sx={{
        alignItems: "stretch",
        overflow: "hidden",
        pb: 20,
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
            alignItems="flex-start"
            justifyContent="space-evenly"
          >
            <Grid item xs={12}>
              <Avatar
                sx={{ width: 150, height: 150, mb: 1 }}
                src="https://source.unsplash.com/random/150×150/?profile%20picture"
              />
              <Grid
                item
                xs={12}
                sx={{
                  mb: 1,
                }}
              >
                <ProfileInfo username={username} />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: "left",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "primary.main" }}
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
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Bio
              </Typography>
              <Typography variant="body1">
                {props.profile.bio || "No bio to display"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container direction="row" justifyContent="space-evenly">
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                My Communities
              </Typography>
              <Grid container spacing={2}>
                {props.communities.slice(0, 4).map((element) => (
                  <Grid item xs={6} key={element._id}>
                    <Box
                      sx={{
                        backgroundColor: "#FFF",
                        boxShadow: 1,
                        borderRadius: "10px",
                        color: "primary.main",
                        py: 2,
                        px: 3,
                        textAlign: "start",
                        height: "auto",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {element.title.length > maxCommunityTitleLength
                          ? element.title.substring(
                              0,
                              maxCommunityTitleLength
                            ) + "..."
                          : element.title}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <GroupsIcon fontSize="small" />
                        <Typography
                          variant="p"
                          sx={{
                            color: "#999",
                            pl: "0.5em",
                          }}
                        >
                          {element.memberCount || 0}
                        </Typography>
                      </Stack>
                      <Stack sx={{ mt: "5px" }}>
                        <Typography
                          variant="p"
                          sx={{ fontWeight: 600, color: "primary.main" }}
                        >
                          Latest Activity:
                        </Typography>
                        <Typography
                          variant="p"
                          sx={{
                            color: "neutral.main.dark",
                            textAlign: "left",
                          }}
                        >
                          {convertDate(element.latestActivity)}
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
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Settings
          </Typography>
          <Box
            sx={{
              color: "neutral.main",
              boxShadow: 2,
              py: 1,
              px: 2,
              borderRadius: "10px",
            }}
          >
            <FormControl>
              <FormLabel id="notification-frequency-radios-label">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
            <Box
              sx={{
                mt: 1,
              }}
            >
              <Stack direction="row" spacing={1}>
                <Typography
                  variant="p"
                  sx={{ fontWeight: 600, alignSelf: "center" }}
                >
                  Dark Mode
                </Typography>
                <Switch />
              </Stack>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={8} sx={{}}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Recent Posts
          </Typography>
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
                    backgroundColor: "primary.main",
                    width: "600px",
                    py: 1,
                    px: 2,
                    borderRadius: "10px",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: "#FFF" }}
                  >
                    {element.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#FFF" }}
                  >
                    by {element.creatorName}
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
