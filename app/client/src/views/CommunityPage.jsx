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
 * @author [Brandon Bouchard](brandonjbouchard@gmail.com)
 * @author [Zach Bourque](zachbourque01@gmail)
 * @module
 */

import React, { useState, useEffect, useMemo } from "react";

import {
  Grid,
  Stack,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Divider,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import FlagIcon from "@mui/icons-material/Flag";
import FeedIcon from "@mui/icons-material/Feed";

import { connect } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import PostsList from "../components/PostsList";
import PostModal from "../components/modals/AddPostModal";
import JoinButton from "../components/JoinButton";
import EditCommunityModal from "../components/modals/EditCommunityModal";
import EditModPermsModal from "../components/modals/EditModPermsModal";

import {
  openCommunityMembersModal,
  openAddPostModal,
  openEditCommunityModal,
  openEditModeratorPermissionsModal,
  openDemoteUserModal,
} from "../redux/ducks/modalDuck";
import ResolveFlagsModal from "../components/modals/ResolveFlagsModal";

import {
  getCommunityPosts,
  getCommunity,
  joinCommunity,
  getUsersCommunities,
  getCommunityMembers,
} from "../redux/ducks/communityDuck";
import MarkDownDisplay from "../components/MarkDownDisplay";
import LoadingPage from "./LoadingPage";
import CommunityNotFoundPage from "./CommunityNotFoundPage";
import { isUserModerator } from "../helperFunctions/communityHelpers";
import DemoteUserModal from "../components/modals/DemoteUserModal";
import CommunityMembersModal from "../components/modals/CommunityMembersModal";

const CommunityPage = (props) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [communityFound, setCommunityFound] = useState(true);
  const [moderators, setModerators] = useState([]);

  const { title } = useParams();
  const { userIsModerator } = props.community;

  useEffect(() => {
    (async () => {
      const successful = await props.getCommunity(title);
      if (!successful) {
        setLoading(false);
        setCommunityFound(false);
      }
      await props.getCommunityPosts(title);
      await props.getUsersCommunities();
      setLoading(false);
    })();
    setModerators(props.community.moderators);
  }, []);

  useEffect(() => {
    setModerators(props.community.moderators);
  }, [props.community]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const [isInCommunity, setIsInCommunity] = useState(
    props.community.userIsInCommunity
  );

  const handleJoin = async () => {
    setIsInCommunity(true);
    const successful = await props.joinCommunity(title);
    if (successful === false) {
      setIsInCommunity(false);
    }
  };

  // Join community if query join=true
  const join = useQuery().get("join") === "true";
  if (!isInCommunity && join) handleJoin();

  const handleSettingsClick = () =>
    props.openEditCommunityModal(props.community);

  const handleCommunityModeratorClick = (mod) => {
    if (mod) navigate(`/profile/${mod}`);
  };

  const handleEditModeratorPermissionsClick = (username) => {
    handleMenuClose();
    let moderator = {};
    Object.keys(props.community.moderators).forEach((key) => {
      if (props.community.moderators[key].username === username) {
        moderator = props.community.moderators[key];
      }
    });
    props.openEditModeratorPermissionsModal(moderator);
  };

  let modPermissions = [];
  if (props.community.moderators)
    Object.keys(props.community.moderators).forEach((key) => {
      if (props.community.moderators[key].userId === props.userId) {
        modPermissions = props.community.moderators[key].permissions;
      }
    });

  const [showFlaggedPosts, setShowFlaggedPosts] = useState(false);

  const handleShowFlaggedPosts = () => {
    setShowFlaggedPosts(!showFlaggedPosts);
  };

  const handleDemoteClick = (key) => {
    return () => {
      handleMenuClose();
      props.openDemoteUserModal(props.community.moderators[key].username);
    };
  };

  return loading ? (
    <LoadingPage />
  ) : !communityFound ? (
    <CommunityNotFoundPage title={title} />
  ) : (
    <Box sx={{ pb: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box
            mb="15px"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              px: 1,
              py: 0.5,
              textAlign: "center",
              display: "flex",
              borderRadius: "10px",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={10.65}>
                <Typography
                  variant="h5"
                  component="h5"
                  sx={{
                    pl: "4.5em",
                    fontWeight: 600,
                    pt: 0.25,
                  }}
                >
                  Community Posts
                </Typography>
              </Grid>
              <Grid item xs={1.35}>
                {props.community.userIsModerator && (
                  <Tooltip
                    title={
                      showFlaggedPosts
                        ? "Show All Posts"
                        : "Show Only Flagged Posts"
                    }
                    arrow
                  >
                    <IconButton onClick={handleShowFlaggedPosts}>
                      {showFlaggedPosts ? (
                        <FeedIcon sx={{ color: "white" }} />
                      ) : (
                        <FlagIcon sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton onClick={() => props.openAddPostModal()}>
                  <AddIcon
                    sx={{
                      color: "white",
                      pl: !props.community.userIsModerator && 4,
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>

            <PostModal
              communityName={title}
              onClose={() => setShow(false)}
              show={show}
            />
          </Box>
          {props.posts.length > 0 ? (
            showFlaggedPosts === true ? (
              <PostsList
                posts={props.posts.filter((post) => post.flags.length > 0)}
              />
            ) : (
              <PostsList posts={props.posts} />
            )
          ) : (
            <Box sx={{ mt: 5 }}>
              <Typography
                variant="h5"
                textAlign="center"
                sx={{ fontWeight: 600 }}
              >
                This community doesn't have any posts yet.
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                sx={{ fontWeight: 600 }}
              >
                Press the "+" icon to create a post.
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item align="center" xs={4}>
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              color: "white",
              px: 1,
              py: 0.5,
              textAlign: "center",
            }}
          >
            <Stack direction="row">
              {props.community.creator === props.userId ? (
                <>
                  <Typography
                    variant="h6"
                    component="h5"
                    sx={{
                      flexGrow: 6,
                      pl: 8,
                      textAlign: "center",
                    }}
                  >
                    Community
                  </Typography>
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={handleSettingsClick}
                  >
                    <SettingsTwoToneIcon sx={{ color: "white", pl: 3 }} />
                  </Button>
                </>
              ) : (
                <Typography
                  variant="h6"
                  component="h5"
                  sx={{
                    flexGrow: 6,
                    textAlign: "center",
                  }}
                >
                  Community
                </Typography>
              )}
            </Stack>
          </Box>
          <Box
            sx={{
              backgroundColor: "card.main",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              boxShadow: 1,
              border: 0,
            }}
          >
            <Stack spacing={1} sx={{ p: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {title}
              </Typography>
              <MarkDownDisplay message={props.community.description} />
              <Box>
                <JoinButton community={props.community} />
              </Box>
            </Stack>
          </Box>
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              pt: 1,
              pb: 1,
              mt: 3,
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Community Members</Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              backgroundColor: "card.main",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              boxShadow: 1,
              border: 0,
            }}
          >
            <Button
              variant="contained"
              disableRipple
              onClick={props.openCommunityMembersModal}
              sx={{
                backgroundColor: "banner.main",
                textTransform: "none",
                width: "max-content",
                alignSelf: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.3em",
                }}
              >
                Members Of This Community: {props.community.memberCount || 0}
              </Typography>
            </Button>
            {moderators && moderators.length > 0 && (
              <>
                <Typography sx={{ fontSize: "1.3em", py: 1 }}>
                  Moderated By:
                </Typography>
                <Box sx={{ flexWrap: "wrap" }}>
                  {Object.keys(moderators).map((key) => (
                    <Stack
                      direction="row"
                      spacing={0}
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        pl: userIsModerator ? 1.5 : 0,
                        py: 0.2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          ":hover": {
                            textDecoration: "underline",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() =>
                          handleCommunityModeratorClick(
                            moderators[key].username
                          )
                        }
                      >
                        {moderators[key].name ?? moderators[key].username}
                      </Typography>
                      {userIsModerator && (
                        <>
                          <IconButton
                            aria-label="settings"
                            onClick={handleMenuOpen}
                            sx={{ py: 0.2 }}
                          >
                            <AdminPanelSettingsIcon />
                          </IconButton>
                          <Menu
                            open={!!anchorEl}
                            onClose={handleMenuClose}
                            anchorEl={anchorEl}
                          >
                            <MenuList>
                              {modPermissions &&
                                modPermissions.includes("set_permissions") && (
                                  <MenuItem
                                    onClick={() =>
                                      handleEditModeratorPermissionsClick(
                                        moderators[key].username
                                      )
                                    }
                                  >
                                    <ListItemIcon>
                                      <EditAttributesIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>
                                      Edit Permissions
                                    </ListItemText>
                                  </MenuItem>
                                )}
                              <MenuItem onClick={handleDemoteClick(key)}>
                                <ListItemIcon>
                                  <PersonRemoveIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Demote</ListItemText>
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </>
                      )}
                    </Stack>
                  ))}
                </Box>
              </>
            )}
          </Box>
          {props.community.rules && props.community.rules.length > 0 && (
            <Box
              sx={{
                borderRadius: "10px",
                textAlign: "left",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  pt: 1,
                  pb: 1,
                  mt: 3,
                  color: "white",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">Community Rules</Typography>
              </Box>
              {props.community.rules.map((obj) => (
                <Accordion key={props.community.rules.indexOf(obj)}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: "card.main",
                      borderBottomLeftRadius:
                        props.community.rules.indexOf(obj) ===
                          props.community.rules.length - 1 && "10px",
                      borderBottomRightRadius:
                        props.community.rules.indexOf(obj) ===
                          props.community.rules.length - 1 && "10px",
                    }}
                  >
                    <Typography>
                      {props.community.rules.indexOf(obj) + 1}. {obj.rule}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "card.main" }}>
                    <Typography>{obj.description}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
          {props.community.resources && props.community.resources.length > 0 && (
            <Box
              sx={{
                borderRadius: "10px",
                textAlign: "left",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  pt: 1,
                  pb: 1,
                  mt: 3,
                  color: "white",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">Community Resources</Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "card.main",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  boxShadow: 1,
                  border: 0,
                }}
              >
                <MarkDownDisplay message={props.community.resources} />
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
      <EditCommunityModal />
      <EditModPermsModal community={props.community.title} />
      <ResolveFlagsModal />
      <DemoteUserModal />
      <CommunityMembersModal
        isUserModerator={userIsModerator}
        community={props.community}
      />
    </Box>
  );
};

CommunityPage.propTypes = {
  getCommunityPosts: PropTypes.func.isRequired,
  getCommunity: PropTypes.func.isRequired,
  community: PropTypes.object.isRequired,
  getUsersCommunities: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  community:
    state.communities.communities[state.communities.currentCommunityIndex] ??
    {},
  posts: state.posts.items.filter(
    (post) =>
      post.community ===
      state.communities.communities[state.communities.currentCommunityIndex]
        ?.title
  ),
  userId: state.auth.user.id,
});

const mapDispatchToProps = {
  getCommunityPosts,
  getUsersCommunities,
  getCommunity,
  openEditCommunityModal,
  openEditModeratorPermissionsModal,
  openAddPostModal,
  openCommunityMembersModal,
  joinCommunity,
  openDemoteUserModal,
  getCommunityMembers,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityPage);
