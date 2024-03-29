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
  openEditAvatarModal,
} from "../redux/ducks/modalDuck";
import { getUsersCommunities } from "../redux/ducks/communityDuck";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  Grid,
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Button,
  Divider,
  Badge,
  Tooltip,
} from "@mui/material";

import { default as BackArrow } from "@mui/icons-material/ArrowBackIosNewRounded";
import { default as ForwardArrow } from "@mui/icons-material/ArrowForwardIosRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Carousel from "react-material-ui-carousel";
import AvatarIcon from "../components/AvatarIcon";

import ProfileInfo from "../components/ProfileInfo";
import Community from "../components/Community";
import EditUserBioModal from "../components/modals/EditUserBioModal";
import EditUserInterestsModal from "../components/modals/EditUserInterestsModal";
import EditAvatarModal from "../components/modals/EditAvatarModal";
import SettingsModal from "../components/modals/SettingsModal";
import EditPostModal from "../components/modals/EditPostModal";
import FlagPostModal from "../components/modals/FlagPostModal";
import DeletePostModal from "../components/modals/DeletePostModal";
import Croutons from "../components/Croutons";

const ProfilePage = (props) => {
  let { username } = useParams();
  const bioWidth = "90ch";
  const body2TextColor = "#999";

  const interestsWidth = 200;

  useEffect(() => {
    props.getProfile(username);
    props.getUserPosts(username);
  }, [username]);

  props.profile.initials = props.profile.lastName
    ? `${props.profile.firstName?.charAt(0)}${props.profile.lastName?.charAt(
        0
      )}`
    : props.profile.firstName?.charAt(0) || username?.charAt(0);

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

  const handleEditAvatarClick = (userSettings) =>
    props.openEditAvatarModal(userSettings);

  const userHasPosts = props.posts?.length > 0;
  const userHasCommunities = props.profile?.communities?.length > 0;

  return (
    <Box
      sx={{
        overflow: "hidden",
        pb: 20,
      }}
    >
      <Croutons profile={true} firstCrumb={`${username}`} />
      <Grid
        container
        justifySelf="center"
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="start"
        gap={1}
      >
        <Grid item xs={2} mr={8} mt={2} pb={3}>
          <Button
            sx={{
              borderRadius: "50%",
              height: "155px",
              width: "155px",
              pl: 0,
              mr: 1,
              ml: 0,
              mb: 1,
            }}
            onClick={() => {
              props.username === username &&
                handleEditAvatarClick(props.profile);
            }}
          >
            <Badge
              badgeContent={
                <Tooltip
                  title={
                    <Typography>
                      {props.profile?.online ? "Online" : "Offline"}
                    </Typography>
                  }
                  arrow
                >
                  <Box width={1} height={1} />
                </Tooltip>
              }
              color={props.profile?.online ? "onlineStatus" : "offlineStatus"}
            >
              <AvatarIcon
                type={props.profile.avatar?.avatarType ?? ""}
                initials={props.profile?.initials ?? ""}
                image={props.profile.avatar?.image ?? ""}
                gradient={props.profile.avatar?.gradient ?? ""}
                colors={props.profile.avatar?.colors ?? {}}
                size={150}
              />
            </Badge>
          </Button>
          <ProfileInfo profile={props.profile} />
          <Stack direction="column" spacing={1} width="20vw">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Interests
              </Typography>
              {props.username === username && (
                <IconButton
                  onClick={() =>
                    handleEditUserInterestsClick(props.profile.interests)
                  }
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
            <Box sx={{ flexWrap: "wrap", maxWidth: interestsWidth }}>
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
          <Stack direction="column" spacing={1} width="20vw">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Contact
            </Typography>

            <Box>
              <a href={`mailto:${props.profile.email}`}>
                <Typography
                  fontWeight={600}
                  sx={{
                    color: body2TextColor,
                    textDecoration: "inherit",
                  }}
                >
                  {props.profile.email}
                </Typography>
              </a>
            </Box>
          </Stack>
          {props.username === username && (
            <Stack direction="row" alignItems="center" my={2} p={0}>
              <Typography variant="h6" fontWeight={600}>
                Settings
              </Typography>
              <IconButton onClick={() => handleSettingsClick(props.profile)}>
                <SettingsRoundedIcon fontSize="medium" />
              </IconButton>
            </Stack>
          )}
        </Grid>
        <Grid item xs={8}>
          <Box minHeight="5vh" width="max-content" mb={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="h5" fontWeight={600}>
                About Me
              </Typography>
              {props.username === username && (
                <IconButton
                  onClick={() => handleEditBioClick(props.profile.bio)}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
            <Typography maxWidth={bioWidth} variant="body1">
              {props.profile.bio}
            </Typography>
          </Box>
          {(userHasPosts || userHasCommunities) && (
            <div>
              <Box
                sx={{
                  backgroundColor: "backgroundSecondary.main",
                  borderRadius: "7.5px",
                  width: "100%",
                  padding: 3,
                }}
              >
                {userHasCommunities && (
                  <div>
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
                      {props.profile.communities?.slice(0, 4).map((element) => (
                        <Community
                          community={element}
                          key={element._id}
                          hideJoinButton
                        />
                      ))}
                    </Carousel>
                  </div>
                )}

                {userHasPosts && (
                  <div>
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
                  </div>
                )}
              </Box>
            </div>
          )}
        </Grid>
      </Grid>
      <EditPostModal />
      <FlagPostModal />
      <DeletePostModal />
      <EditUserBioModal user={username} />
      <EditUserInterestsModal user={username} />
      <EditAvatarModal />
      <SettingsModal />
    </Box>
  );
};

ProfilePage.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  openSettingsModal: PropTypes.func.isRequired,
  openEditUserBioModal: PropTypes.func.isRequired,
  openEditUserInterestsModal: PropTypes.func.isRequired,
  openEditAvatarModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  username: state.auth.user.username,
  profile: state.profile.user,
  posts: state.posts.items.filter(
    (post) => post.creatorUsername === state.profile.user.username
  ),
});

const mapActionsToProps = {
  getProfile,
  getUserPosts,
  openSettingsModal,
  openEditUserBioModal,
  openEditUserInterestsModal,
  openEditAvatarModal,
};

export default connect(mapStateToProps, mapActionsToProps)(ProfilePage);
