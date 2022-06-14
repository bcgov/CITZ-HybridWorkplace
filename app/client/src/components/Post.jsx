import {
  Button,
  Card,
  Grid,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  TextField,
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
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost } from "../redux/ducks/postDuck";
import { useNavigate } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";

const Post = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.post) {
      props.getPost(id);
    }
  }, []);

  const post = props.post || props.fetchedPost;

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

  return (
    <div key={post._id}>
      <Card
        sx={{
          px: 1,
          py: 0,
          margin: "auto",
        }}
        variant="outlined"
        square
      >
        <CardHeader
          action={
            <>
              <IconButton aria-label="settings" onClick={handleMenuOpen}>
                <MoreVertIcon />
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
              <Grid item xs={10}>
                <Typography
                  variant="h4"
                  onClick={handlePostClick}
                  style={{ cursor: "pointer" }}
                >
                  {post.title}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography
                  onClick={() => handleCommunityClick(post.community)}
                >
                  {post.community}
                </Typography>
              </Grid>
            </Grid>
          }
          subheader={`by ${post.creatorName}`}
        />
        <CardContent onClick={handlePostClick} style={{ cursor: "pointer" }}>
          <Typography variant="body1">{post.message}</Typography>
        </CardContent>
        <CardActions>
          <CommentIcon fontSize="small" />
          <Typography pl="5px" pr="30px">
            {post.commentCount || 0}
          </Typography>
          <TagsList post={post} />
        </CardActions>
      </Card>
    </div>
  );
};

Post.propTypes = {
  joinCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  flagPostOpen: state.modal.flagPost.open,
  deletePostOpen: state.modal.deletePost.open,
  fetchedPost: state.posts.item,
});

const mapActionsToProps = {
  openFlagPostModal,
  openDeletePostModal,
  openEditPostModal,
  getPost,
};

export default connect(mapStateToProps, mapActionsToProps)(Post);
