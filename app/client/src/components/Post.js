import {
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
import TagsList from "./tagsList";

const Post = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { post } = props;

  const handleFlagPostClick = () => {
    props.openFlagPostModal(post);
    handleMenuClose();
  };

  const handleDeletePostClick = () => {
    props.openDeletePostModal(post);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
                </MenuList>
              </Menu>
            </>
          }
          title={<Typography variant="h4">{post.title}</Typography>}
        />
        <CardContent>
          <Typography variant="body1">{post.message}</Typography>
        </CardContent>
        <CardActions>
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
});

const mapActionsToProps = {
  openFlagPostModal,
  openDeletePostModal,
};

export default connect(mapStateToProps, mapActionsToProps)(Post);
