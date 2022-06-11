import {
  Avatar,
  Card,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import React, { useState } from "react";
import { openDeleteCommentModal } from "../redux/ducks/modalDuck";
import { connect } from "react-redux";

export const Comment = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleDeleteCommentClick = () => {
    props.openDeleteCommentModal(props.comment);
    handleMenuClose();
  };

  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

  return (
    <Card style={{ margin: 10 }}>
      <CardHeader
        title={
          <Typography variant="body1">
            {props.comment.creatorName || "Unknown Commenter"}
          </Typography>
        }
        avatar={<Avatar />}
        action={
          props.userId === props.comment.creator && (
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
                  <MenuItem onClick={handleDeleteCommentClick}>
                    <ListItemIcon>
                      <DeleteForeverTwoToneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )
        }
      />
      <CardContent>
        <Typography variant="body2">{props.comment.message}</Typography>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
});

const mapDispatchToProps = { openDeleteCommentModal };

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
