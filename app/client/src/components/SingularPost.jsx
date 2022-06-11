import {
  Button,
  Card,
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
import { openFlagPostModal } from "../redux/ducks/modalDuck";
import { openDeletePostModal } from "../redux/ducks/modalDuck";
import { useState } from "react";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import TagsList from "./TagsList";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../redux/ducks/postDuck";
import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";

const SingularPost = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  let { id } = useParams();

  useEffect(() => {
    props.post._id === id || props.getPost(id);
  }, []);

  const handleFlagPostClick = () => {
    props.openFlagPostModal(props.post);
    handleMenuClose();
  };

  const handleDeletePostClick = () => {
    props.openDeletePostModal(props.post);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <div key={props.post._id}>
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
                </MenuList>
              </Menu>
            </>
          }
          title={<Typography variant="h4">{props.post.title}</Typography>}
        />
        <CardContent>
          <Typography variant="body1">{props.post.message}</Typography>
        </CardContent>
        <CardActions>
          <TagsList post={props.post} />
        </CardActions>
      </Card>
      <CreateComment post={props.post} />
      <CommentsList comments={props.post.comments} />
    </div>
  );
};

SingularPost.propTypes = {};

const mapStateToProps = (state) => ({
  post: state.posts.item,
});

const mapActionsToProps = {
  openFlagPostModal,
  openDeletePostModal,
  getPost,
};

export default connect(mapStateToProps, mapActionsToProps)(SingularPost);
