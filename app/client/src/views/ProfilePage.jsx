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
import { getUserPosts } from "../redux/ducks/postDuck";
import Post from "../components/Post";
import {
  openSettingsModal,
  openEditUserBioModal,
  openEditUserInterestsModal,
} from "../redux/ducks/modalDuck";
import { getUsersCommunities } from "../redux/ducks/communityDuck";
import SettingsModal from "../components/modals/SettingsModal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";

import {
  Grid,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";

import { default as BackArrow } from "@mui/icons-material/ArrowBackIosNewRounded";
import { default as ForwardArrow } from "@mui/icons-material/ArrowForwardIosRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Carousel from "react-material-ui-carousel";

import ProfileInfo from "../components/ProfileInfo";
import Community from "../components/Community";
import EditUserBioModal from "../components/modals/EditUserBioModal";
import EditUserInterestsModal from "../components/modals/EditUserInterestsModal";
import EditPostModal from "../components/modals/EditPostModal";
import FlagPostModal from "../components/modals/FlagPostModal";
import DeletePostModal from "../components/modals/DeletePostModal";

const ProfilePage = (props) => {
  let { username } = useParams();
  const maxCommunityTitleLength = 12;

  useEffect(() => {
    props.getProfile(username);
    props.getUsersCommunities();
    props.getUserPosts(username);
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

  const handleEditBioClick = (userBio) => props.openEditUserBioModal(userBio);

  const handleSettingsClick = (userSettings) =>
    props.openSettingsModal(userSettings);

  const handleEditUserInterestsClick = (userInterests) =>
    props.openEditUserInterestsModal(userInterests ?? []);

  const randomColor = () => {
    const colors = [
      "#2A9CA7",
      "#5276D8",
      "#D459C0",
      "#D15C5E",
      "#C48923",
      "#C43A48",
      "#CC622D",
      "#1C85D6",
      "#4771E4",
      "#1BB879",
      "#559E2D",
      "#A141D2",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
        pb: 20,
      }}
    >
      <Grid
        container
        justifySelf="center"
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="start"
        gap={1}
      >
        <Grid item xs={2} mr={5}>
          <Avatar
            sx={{
              width: 150,
              height: 150,
              mb: 1,
            }}
            src="https://source.unsplash.com/random/150×150/?profile%20picture"
          />
          <ProfileInfo username={username} />
          <Stack direction="column" spacing={1} width="20vw">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Interests
              </Typography>
              <IconButton
                onClick={() =>
                  handleEditUserInterestsClick(props.profile.interests)
                }
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box sx={{ flexWrap: "wrap", width: 250 }}>
              {props.profile.interests?.map((interest) => (
                <Chip
                  label={interest}
                  key={props.profile.interests.indexOf(interest)}
                  sx={{
                    mb: 1,
                    mr: 1,
                    px: 1,
                    backgroundColor: randomColor(),
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" my={2} p={0}>
            <Typography variant="h6" fontWeight={600}>
              Settings
            </Typography>
            <IconButton onClick={() => handleSettingsClick(props.profile)}>
              <SettingsRoundedIcon fontSize="medium" />
            </IconButton>
          </Stack>
        </Grid>
        <Grid item xs={8}>
          <Box minHeight="5vh" width="max-content" mb={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="h5" fontWeight={600}>
                About Me
              </Typography>
              <IconButton onClick={() => handleEditBioClick(props.profile)}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Typography variant="body1">
              {props.profile.bio || "No bio to display"}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            My Communities
          </Typography>
          <Carousel
            NextIcon={<ForwardArrow />}
            PrevIcon={<BackArrow />}
            autoPlay={false}
            animation="slide"
            duration={500}
            fullHeightHover={false}
            sx={{ borderRadius: "10px" }}
          >
            {props.communities.slice(0, 4).map((element) => (
              <Community community={element} key={element._id} />
            ))}
          </Carousel>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            My Recent Posts
          </Typography>
          <Carousel
            NextIcon={<ForwardArrow />}
            PrevIcon={<BackArrow />}
            autoPlay={false}
            animation="slide"
            duration={500}
            fullHeightHover={false}
            sx={{ borderRadius: "10px" }}
          >
            {props.posts.slice(0, 4).map((post) => (
              <Post post={post} key={post._id} />
            ))}
          </Carousel>
        </Grid>
      </Grid>
      <EditPostModal />
      <FlagPostModal />
      <DeletePostModal />
      <EditUserBioModal user={username} />
      <EditUserInterestsModal user={username} />
      <SettingsModal />
    </Box>
  );
};

ProfilePage.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  communities: PropTypes.array.isRequired,
  posts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.user,
  communities: state.communities.usersCommunities,
  posts: state.posts.userPosts,
});

const mapActionsToProps = {
  getProfile,
  getUserPosts,
  getUsersCommunities,
  openSettingsModal,
  openEditUserBioModal,
  openEditUserInterestsModal,
};

export default connect(mapStateToProps, mapActionsToProps)(ProfilePage);
