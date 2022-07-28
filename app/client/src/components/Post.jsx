import {
  Card,
  Grid,
  Box,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import FlagTwoToneIcon from "@mui/icons-material/FlagTwoTone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  openFlagPostModal,
  openDeletePostModal,
  openEditPostModal,
  openResolveFlagsModal,
} from "../redux/ducks/modalDuck";
import { useEffect, useState } from "react";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import TagsList from "./TagsList";
import { useParams } from "react-router-dom";
import { getCommunity } from "../redux/ducks/communityDuck";
import { useNavigate } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import moment from "moment";
import { getDarkModePreference } from "../theme";
import MarkDownDisplay from "./MarkDownDisplay";
import { editPost } from "../redux/ducks/postDuck";
import { FlagRounded } from "@mui/icons-material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const Post = (props) => {
  useEffect(() => {
    (async () => {
      await props.getCommunity(props.post.community);
    })();
  }, []);
  const maxTitleLength = 58;
  const maxCommunityTitleLength = 16;
  const maxMessageLines = 5;

  const [anchorEl, setAnchorEl] = useState(null);
  const [darkModePreference] = useState(getDarkModePreference());

  const isModerator = props.communities.find(
    (comm) => comm.title === props.post.community
  )?.userIsModerator;

  const navigate = useNavigate();

  const post = props.post;

  const editPost = async (field) => {
    let post = {};
    switch (field) {
      case "pinned":
        post = {
          id: props.post._id,
          title: props.post.title,
          message: props.post.message,
          pinned: !props.post.pinned,
          hidden: props.post.hidden,
        };
        break;
      case "hidden":
        post = {
          id: props.post._id,
          title: props.post.title,
          message: props.post.message,
          pinned: props.post.pinned,
          hidden: !props.post.hidden,
        };
        break;
      default:
        return;
    }

    await props.editPost(post);
  };

  const handleFlagPostClick = () => {
    props.openFlagPostModal(post);
    handleMenuClose();
  };

  const handleDeletePostClick = () => {
    props.openDeletePostModal(post);
    handleMenuClose();
  };

  const handleEditPostClick = () => {
    props.openEditPostModal(post);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handlePostClick = () =>
    !props.isPostPage && navigate(`/post/${post._id}`);
  const handleCommunityClick = (title) => navigate(`/community/${title}`);
  const handlePostCreatorClick = (creator) => {
    if (creator) navigate(`/profile/${creator}`);
  };
  const handleFlagIconClick = () => props.openResolveFlagsModal(post);

  // Create preview if post message has more than maxMessageLines lines
  let message = post.message;
  if (!props.isPostPage && message.split("\n").length > maxMessageLines) {
    const initialValue = "";
    message =
      message
        .split("\n")
        .slice(0, maxMessageLines)
        .reduce((prev, curr) => prev + curr + "\n", initialValue) + "...";
  }

  // Convert to local time
  let createdOn =
    moment(moment.utc(post.createdOn, "MMMM Do YYYY, h:mm:ss a").toDate())
      .local()
      .format("MMMM Do YYYY, h:mm:ss a") || "";
  // Remove milliseconds
  createdOn = `${createdOn.substring(
    0,
    createdOn.length - 6
  )} ${createdOn.substring(createdOn.length - 2, createdOn.length)}`;
  const splitCreatedOn = createdOn.split(",");

  const today = moment().format("MMMM Do YYYY");
  const yesterday = moment().subtract(1, "days").format("MMMM Do YYYY");

  if (splitCreatedOn[0] === today) createdOn = `Today${splitCreatedOn[1]}`;
  if (splitCreatedOn[0] === yesterday)
    createdOn = `Yesterday${splitCreatedOn[1]}`;

  return (
    <Box key={post._id} sx={{ mb: "15px", backgroundColor: "transparent" }}>
      <Card
        sx={{
          px: 0,
          py: 0,
          margin: "auto",
          borderRadius: "10px",
          border: 0,
          boxShadow: 1,
        }}
        variant="outlined"
        square
      >
        <CardHeader
          sx={{
            backgroundColor: props.post.removed
              ? "#5E2F2F"
              : props.post.hidden
              ? "#9C9C9C"
              : "banner.main",
            color: "white",
            py: 1,
          }}
          action={
            <Box>
              <IconButton aria-label="settings" onClick={handleMenuOpen}>
                <MoreVertIcon sx={{ color: "white" }} />
              </IconButton>
              <Menu
                open={!!anchorEl}
                onClose={handleMenuClose}
                anchorEl={anchorEl}
              >
                <MenuList>
                  <MenuItem onClick={handleFlagPostClick}>
                    <ListItemIcon>
                      <FlagTwoToneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Flag</ListItemText>
                  </MenuItem>
                  {(props.userId === post.creator ||
                    props.role === "admin") && (
                    <MenuItem onClick={handleDeletePostClick}>
                      <ListItemIcon>
                        <DeleteForeverTwoToneIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  )}
                  {(props.userId === post.creator ||
                    isModerator ||
                    props.role === "admin") && (
                    <MenuItem onClick={handleEditPostClick}>
                      <ListItemIcon>
                        <EditTwoToneIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                  )}
                  {(isModerator || props.role === "admin") && (
                    <Box>
                      <MenuItem onClick={() => editPost("hidden")}>
                        <ListItemIcon>
                          <VisibilityOffIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          {props.post.hidden ? "Show" : "Hide"}
                        </ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => editPost("pinned")}>
                        <ListItemIcon>
                          <PushPinIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          {props.post.pinned ? "Unpin" : "Pin"}
                        </ListItemText>
                      </MenuItem>
                    </Box>
                  )}
                </MenuList>
              </Menu>
            </Box>
          }
          title={
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: "center" }}
                >
                  {props.post.removed && (
                    <Tooltip
                      title={<Typography>Removed Post</Typography>}
                      arrow
                    >
                      <RemoveCircleIcon />
                    </Tooltip>
                  )}
                  {props.post.hidden && (
                    <Tooltip title={<Typography>Hidden Post</Typography>} arrow>
                      <VisibilityOffIcon />
                    </Tooltip>
                  )}
                  {props.post.pinned && (
                    <Tooltip title={<Typography>Pinned Post</Typography>} arrow>
                      <PushPinIcon />
                    </Tooltip>
                  )}
                  {props.post.flags.length > 0 &&
                    (isModerator || props.role === "admin") && (
                      <Tooltip
                        title={<Typography>Flagged Post</Typography>}
                        arrow
                      >
                        <IconButton
                          onClick={handleFlagIconClick}
                          sx={{ padding: 0 }}
                        >
                          <FlagRounded
                            sx={{
                              color: "#FF4500",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  <Typography
                    variant="h6"
                    onClick={handlePostClick}
                    sx={{
                      cursor: props.isPostPage || "pointer",
                    }}
                  >
                    <b>
                      {post.title.length >= maxTitleLength
                        ? post.title.substring(0, maxTitleLength) + "..."
                        : post.title}
                    </b>
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  onClick={() => handleCommunityClick(post.community)}
                  sx={{
                    ":hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                  align="right"
                >
                  {post.community.length > maxCommunityTitleLength
                    ? post.community.substring(0, maxCommunityTitleLength) +
                      "..."
                    : post.community}
                </Typography>
              </Grid>
            </Grid>
          }
          subheader={
            <Stack direction="row" spacing={0.5}>
              <Typography color="white">{"by "}</Typography>
              <Typography
                sx={{
                  display: "inline-block",
                  ":hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
                onClick={() =>
                  handlePostCreatorClick(props.post.creatorUsername)
                }
                color="white"
              >
                {props.post.creatorName}
              </Typography>
            </Stack>
          }
        />
        <CardContent
          onClick={handlePostClick}
          sx={{
            cursor: props.isPostPage || "pointer",
          }}
        >
          <Box name="postMessage" data-color-mode={darkModePreference}>
            <MarkDownDisplay message={message} />
          </Box>
        </CardContent>
        <CardActions>
          <IconButton onClick={handlePostClick}>
            <CommentIcon fontSize="small" />
          </IconButton>

          {post.availableTags.length ? (
            <>
              <Typography pl="5px" pr="30px">
                {post.commentCount || 0}
              </Typography>
              <TagsList post={post} />
              <Typography pl="30px" color="#898989">
                Published: {createdOn}
              </Typography>
            </>
          ) : (
            <>
              <Typography pl="5px" pr="5px">
                {post.commentCount || 0}
              </Typography>
              <Typography pl="5px" color="#898989">
                Published: {createdOn}
              </Typography>
            </>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

Post.propTypes = {
  openFlagPostModal: PropTypes.func.isRequired,
  openDeletePostModal: PropTypes.func.isRequired,
  openEditPostModal: PropTypes.func.isRequired,
  getCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
  role: state.auth.user.role,
  communities: state.communities.communities,
});

const mapActionsToProps = {
  openFlagPostModal,
  openDeletePostModal,
  openEditPostModal,
  getCommunity,
  editPost,
  openResolveFlagsModal,
};

export default connect(mapStateToProps, mapActionsToProps)(Post);
