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
} from "@mui/material";
import FlagTwoToneIcon from "@mui/icons-material/FlagTwoTone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  openFlagPostModal,
  openDeletePostModal,
  openEditPostModal,
} from "../redux/ducks/modalDuck";
import { useState } from "react";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import TagsList from "./TagsList";
import { useParams } from "react-router-dom";
import { getPost } from "../redux/ducks/postDuck";
import { useNavigate } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import moment from "moment";

const Post = (props) => {
  const maxTitleLength = 45;
  const maxCommunityTitleLength = 16;

  const [anchorEl, setAnchorEl] = useState(null);

  const [commNameHover, setCommNameHover] = useState(false);
  const onCommNameHoverEnter = () => {
    setCommNameHover(true);
  };
  const onCommNameHoverLeave = () => {
    setCommNameHover(false);
  };

  const [cardHover, setCardHover] = useState(false);
  const onCardHoverEnter = () => {
    setCardHover(true);
  };
  const onCardHoverLeave = () => {
    setCardHover(false);
  };
  let { id } = useParams();

  const navigate = useNavigate();

  const post = props.post;

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
  const handlePostClick = () => navigate(`/post/${post._id}`);
  const handleCommunityClick = (title) => navigate(`/community/${title}`);

  // Create preview if post message is longer than 250 characters
  let message = post.message;
  if (message.length > 250 && !props.isPostPage) {
    message = `${message.substring(0, 249)}...`;
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
          border: 1,
          borderColor: cardHover ? "gray" : "darkgray",
        }}
        variant="outlined"
        square
        onMouseEnter={onCardHoverEnter}
        onMouseLeave={onCardHoverLeave}
      >
        <CardHeader
          sx={{ backgroundColor: "#0072A2", color: "white", py: 1 }}
          action={
            <>
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
                  <MenuItem onClick={handleDeletePostClick}>
                    <ListItemIcon>
                      <DeleteForeverTwoToneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleEditPostClick}>
                    <ListItemIcon>
                      <EditTwoToneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          }
          title={
            <Grid container spacing={2}>
              <Grid item xs={9}>
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
              </Grid>
              <Grid item xs={3}>
                <Typography
                  onClick={() => handleCommunityClick(post.community)}
                  sx={{
                    cursor: "pointer",
                    textDecoration: commNameHover ? "underline" : "",
                    textAlign: "right",
                  }}
                  onMouseEnter={onCommNameHoverEnter}
                  onMouseLeave={onCommNameHoverLeave}
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
            <Typography color="white">by {props.post.creatorName}</Typography>
          }
        />
        <CardContent
          onClick={handlePostClick}
          sx={{ cursor: props.isPostPage || "pointer" }}
        >
          <Typography variant="body1">{message}</Typography>
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
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  openFlagPostModal,
  openDeletePostModal,
  openEditPostModal,
  getPost,
};

export default connect(mapStateToProps, mapActionsToProps)(Post);
