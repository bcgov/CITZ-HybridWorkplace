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
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import React, { useState } from "react";
import {
  openDeleteCommentModal,
  openFlagCommentModal,
} from "../redux/ducks/modalDuck";
import FlagTwoToneIcon from "@mui/icons-material/FlagTwoTone";

import { connect } from "react-redux";
import moment from "moment";
import CommentReply from "./CommentReply";
import CommentRepliesList from "./CommentRepliesList";
import { useNavigate } from "react-router-dom";

export const Comment = (props) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleDeleteCommentClick = () => {
    props.openDeleteCommentModal(props.comment);
    handleMenuClose();
  };

  const handleFlagCommentClick = () => {
    props.openFlagCommentModal(props.comment);
    handleMenuClose();
  };

  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const today = moment().format("MMMM Do YYYY");
  const yesterday = moment().subtract(1, "days").format("MMMM Do YYYY");

  // Convert to local time
  const editTimeStamp = props.comment.edits[0]
    ? props.comment.edits[0].timeStamp || ""
    : "";
  let editDate =
    moment(moment.utc(editTimeStamp, "MMMM Do YYYY, h:mm:ss a").toDate())
      .local()
      .format("MMMM Do YYYY") || "";

  if (editDate.split(",")[0] === today) editDate = `Today`;
  if (editDate.split(",")[0] === yesterday) editDate = `Yesterday`;

  // Convert to local time
  let createdOn =
    moment(
      moment.utc(props.comment.createdOn, "MMMM Do YYYY, h:mm:ss a").toDate()
    )
      .local()
      .format("MMMM Do YYYY, h:mm:ss a") || "";
  // Remove milliseconds
  createdOn = `${createdOn.substring(
    0,
    createdOn.length - 6
  )} ${createdOn.substring(createdOn.length - 2, createdOn.length)}`;
  const splitCreatedOn = createdOn.split(",");

  if (splitCreatedOn[0] === today) createdOn = `Today,${splitCreatedOn[1]}`;
  if (splitCreatedOn[0] === yesterday)
    createdOn = `Yesterday,${splitCreatedOn[1]}`;

  const [replyOpen, setReplyOpen] = useState(false);
  const openReply = () => {
    setReplyOpen(true);
  };
  const closeReply = () => {
    setReplyOpen(false);
  };
  const handleCommentCreatorClick = (creator) =>
    navigate(`/profile/${creator}`);

  return (
    <Grid container justifyContent="flex-end">
      <Grid item xs={12}>
        <Card style={{ margin: 10 }}>
          <CardHeader
            title={
              <Typography
                variant="h5"
                sx={{
                  display: "inline-block",
                  ":hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
                onClick={() =>
                  handleCommentCreatorClick(props.comment.creatorName)
                }
              >
                {props.comment.creatorName || "Unknown Commenter"}
              </Typography>
            }
            subheader={<Typography fontSize="small">{createdOn}</Typography>}
            avatar={
              <Avatar
                fontSize="medium"
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() =>
                  handleCommentCreatorClick(props.comment.creatorName)
                }
              />
            }
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
                      <MenuItem onClick={handleFlagCommentClick}>
                        <ListItemIcon>
                          <FlagTwoToneIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Flag</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              )
            }
          />
          <CardContent sx={{ paddingTop: "0px" }}>
            <Grid container spacing={2}>
              <Grid item xs={11}>
                {props.comment.edits.length > 0 && (
                  <Typography variant="caption" color="#898989">
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
          <CardActions>
            {!props.hideReply && (
              <Button variant="text" onClick={openReply}>
                Reply
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {replyOpen && (
          <CommentReply close={closeReply} commentId={props.comment._id} />
        )}
      </Grid>
      <Grid item xs={12}>
        {!props.isReply && <CommentRepliesList comment={props.comment} />}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
});

const mapDispatchToProps = { openDeleteCommentModal, openFlagCommentModal };

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
