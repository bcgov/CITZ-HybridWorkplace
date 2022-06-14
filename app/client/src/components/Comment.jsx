import {
  Avatar,
  Grid,
  Stack,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
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

  const editTimeStamp = props.comment.edits[0]
    ? props.comment.edits[0].timeStamp || ""
    : "";
  const editDate = editTimeStamp.split(",")[0];

  return (
    <Card style={{ margin: 10 }}>
      <CardHeader
        title={
          <Typography variant="h5">
            {props.comment.creatorName || "Unknown Commenter"}
          </Typography>
        }
        subheader={
          <Typography fontSize="small">{props.comment.createdOn}</Typography>
        }
        avatar={<Avatar fontSize="medium" />}
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
      <CardContent sx={{ "padding-top": "0px" }}>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            {props.comment.edits.length > 0 && (
              <Typography variant="caption" color="#04AECC">
                Edited: {editDate}
              </Typography>
            )}
            <Typography variant="body2">{props.comment.message}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Stack alignItems="flex-end">
              <IconButton aria-label="upvote" sx={{ padding: 0 }}>
                <UpIcon fontSize="small" />
              </IconButton>
              <Typography pr="5px">{props.comment.votes || 0}</Typography>
              <IconButton aria-label="downvote" sx={{ padding: 0 }}>
                <DownIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
});

const mapDispatchToProps = { openDeleteCommentModal };

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
