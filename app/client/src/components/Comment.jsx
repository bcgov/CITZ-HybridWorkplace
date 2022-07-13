import {
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
  Box,
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
import {
  upvoteComment,
  downvoteComment,
  removeCommentVote,
} from "../redux/ducks/postDuck";
import { useNavigate } from "react-router-dom";
import AvatarIcon from "./AvatarIcon";

export const Comment = (props) => {
  const getUserVote = () => {
    return (
      (props.comment.upvotes.users.includes(props.userId) && "up") ||
      (props.comment.downvotes.users.includes(props.userId) && "down") ||
      undefined
    );
  };

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [userVote, setUserVote] = useState(getUserVote());

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
  const handleCommentCreatorClick = (creator) => {
    if (creator) navigate(`/profile/${creator}`);
  };

  const handleUpVote = async () => {
    const commentId = props.comment._id;
    if (!userVote) {
      await props.upvoteComment(commentId);
      setUserVote("up");
      return;
    }

    if (userVote === "up") {
      await props.removeCommentVote(commentId);
      setUserVote(undefined);
    } else if (userVote === "down") {
      await props.removeCommentVote(commentId);
      await props.upvoteComment(commentId);
      setUserVote("up");
    }
  };

  const handleDownVote = async () => {
    const commentId = props.comment._id;
    if (!userVote) {
      await props.downvoteComment(commentId);
      setUserVote("down");
      return;
    }

    if (userVote === "down") {
      await props.removeCommentVote(commentId);
      setUserVote(undefined);
    } else if (userVote === "up") {
      await props.removeCommentVote(commentId);
      await props.downvoteComment(commentId);
      setUserVote("down");
    }
  };

  return (
    <Grid container justifyContent="flex-end">
      <Grid item xs={12}>
        <Stack direction="row">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack alignItems="flex-end" sx={{ alignItems: "center" }}>
              <IconButton
                aria-label="upvote"
                sx={{ padding: 0 }}
                onClick={handleUpVote}
                color={userVote === "up" ? "success" : "default"}
              >
                <UpIcon fontSize="large" />
              </IconButton>
              <Typography fontSize="1.5em" sx={{ textAlign: "center" }}>
                {props.comment.votes || 0}
              </Typography>
              <IconButton
                aria-label="downvote"
                sx={{ padding: 0 }}
                onClick={handleDownVote}
                color={userVote === "down" ? "error" : "default"}
              >
                <DownIcon fontSize="large" />
              </IconButton>
            </Stack>
          </Box>
          <Card style={{ margin: 10, width: "100%" }}>
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
                    handleCommentCreatorClick(props.comment.creatorUsername)
                  }
                >
                  {props.comment.creatorName || "Unknown Commenter"}
                </Typography>
              }
              subheader={<Typography fontSize="small">{createdOn}</Typography>}
              avatar={
                <Box
                  sx={{
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() =>
                    handleCommentCreatorClick(props.comment.creatorUsername)
                  }
                >
                  <AvatarIcon
                    type={props.comment.avatar?.avatarType ?? ""}
                    initials={props.comment?.creatorInitials ?? ""}
                    image={props.comment.avatar?.image ?? ""}
                    gradient={props.comment.avatar?.gradient ?? ""}
                    colors={props.comment.avatar?.colors ?? {}}
                    size={50}
                  />
                </Box>
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
              sx={{ backgroundColor: "card.main" }}
            />
            <CardContent
              sx={{ paddingTop: "0px", backgroundColor: "card.main" }}
            >
              {props.comment.edits.length > 0 && (
                <Typography variant="caption" color="#898989">
                  Edited: {editDate}
                </Typography>
              )}
              <Typography variant="body2">{props.comment.message}</Typography>
            </CardContent>
            <CardActions sx={{ backgroundColor: "card.main" }}>
              {!props.hideReply && (
                <Button variant="text" onClick={openReply} color="button">
                  Reply
                </Button>
              )}
            </CardActions>
          </Card>
        </Stack>
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

const mapDispatchToProps = {
  openDeleteCommentModal,
  openFlagCommentModal,
  upvoteComment,
  downvoteComment,
  removeCommentVote,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
