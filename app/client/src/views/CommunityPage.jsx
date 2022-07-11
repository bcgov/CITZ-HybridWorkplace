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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { connect } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import PostsList from "../components/PostsList";
import PostModal from "../components/modals/AddPostModal";
import JoinButton from "../components/JoinButton";
import { openEditCommunityModal } from "../redux/ducks/modalDuck";
import EditCommunityModal from "../components/modals/EditCommunityModal";
import { openAddPostModal } from "../redux/ducks/modalDuck";
import {
  getCommunityPosts,
  getCommunity,
  joinCommunity,
  getUsersCommunities,
} from "../redux/ducks/communityDuck";

const CommunityPage = (props) => {
  const { communities } = props;
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const { title } = useParams();

  useEffect(() => {
    props.getCommunityPosts(title);
    props.getCommunity(title);
    props.getUsersCommunities();
  }, []);

  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const isUserInCommunity = (communityName) => {
    return (
      communities.find((element) => element.title === communityName) !==
      undefined
    );
  };

  const [isInCommunity, setIsInCommunity] = useState(isUserInCommunity(title));

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
  const handleCommunityCreatorClick = (creator) =>
    navigate(`/profile/${creator}`);

  return (
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
              <Grid item xs={9}>
                <Typography
                  variant="h5"
                  component="h5"
                  sx={{
                    pl: "8em",
                    fontWeight: 600,
                  }}
                >
                  Community Posts
                </Typography>
              </Grid>
              <Grid item xs={3} align="right">
                <Button onClick={() => props.openAddPostModal()}>
                  <AddIcon sx={{ color: "white", pl: 4 }} />
                </Button>
              </Grid>
            </Grid>

            <PostModal
              communityName={title}
              onClose={() => setShow(false)}
              show={show}
            />
          </Box>
          {props.posts.length > 0 ? (
            <PostsList posts={props.posts} />
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
                      fontWeight: 600,
                    }}
                  >
                    {title}
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
                    fontWeight: 600,
                  }}
                >
                  {title}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box
            sx={{
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              boxShadow: 1,
              border: 0,
            }}
          >
            <Stack spacing={1} sx={{ pb: 3 }}>
              <Typography sx={{ mt: 1 }}>
                {props.community.description}
              </Typography>
              <Typography
                sx={{
                  fontStyle: "italic",
                  color: "#898989",
                }}
              >
                Members of this community: {props.community.memberCount || 0}
              </Typography>
              {props.community.creatorName && (
                <Stack direction="row" spacing={0.5} justifyContent="center">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "#0072A2",
                    }}
                  >
                    {"Created by: "}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "#0072A2",
                      ":hover": {
                        textDecoration: "underline",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() =>
                      handleCommunityCreatorClick(props.community.creatorName)
                    }
                  >
                    {props.community.creatorName}
                  </Typography>
                </Stack>
              )}
              <Box>
                <JoinButton community={props.community} />
              </Box>
            </Stack>
          </Box>
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
              <Typography sx={{ fontWeight: "bold", fontStyle: "italic" }}>
                (coming soon)
              </Typography>
            </Box>
            {props.community.rules &&
              props.community.rules.map((obj) => (
                <Accordion key={props.community.rules.indexOf(obj)}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {props.community.rules.indexOf(obj) + 1}. {obj.rule}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{obj.description}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Box>
        </Grid>
      </Grid>
      <EditCommunityModal />
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
  community: state.communities.item,
  communities: state.communities.usersCommunities,
  posts: state.posts.items,
  username: state.auth.user.username,
  userId: state.auth.user.id,
});

const mapDispatchToProps = {
  getCommunityPosts,
  getUsersCommunities,
  getCommunity,
  openEditCommunityModal,
  openAddPostModal,
  joinCommunity,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityPage);
