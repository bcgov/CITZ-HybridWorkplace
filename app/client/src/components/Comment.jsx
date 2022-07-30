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
  Tooltip,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useState } from "react";
import {
  openDeleteCommentModal,
  openFlagCommentModal,
} from "../redux/ducks/modalDuck";
import FlagTwoToneIcon from "@mui/icons-material/FlagTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

import { connect } from "react-redux";
import moment from "moment";
import CommentReply from "./CommentReply";
import CommentRepliesList from "./CommentRepliesList";
import {
  upvoteComment,
  downvoteComment,
  editComment,
} from "../redux/ducks/commentDuck";
import { useNavigate } from "react-router-dom";
import AvatarIcon from "./AvatarIcon";

export const Comment = (props) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [editedComment, setEditedComment] = useState(
    props.comment.message ?? ""
  );

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

  const isModerator = props.communities.find(
    (comm) => comm.title === props.comment.community
  )?.userIsModerator;

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
    props.upvoteComment(props.comment._id);
  };

  const handleDownVote = async () => {
    props.downvoteComment(props.comment._id);
  };

  const handleEditedCommentTextChange = (event) => {
    setEditedComment(event.target.value);
  };

  const handleEditComment = async () => {
    const comment = {
      id: props.comment._id,
      message: editedComment,
    };

    if (editedComment !== props.comment.message)
      await props.editComment(comment);
    setShowInput(false);
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
                color={props.comment.userVote === "up" ? "success" : "default"}
              >
                <UpIcon fontSize="large" />
              </IconButton>
              <Typography fontSize="1.5em" sx={{ textAlign: "center" }}>
                {props.comment.votes}
              </Typography>
              <IconButton
                aria-label="downvote"
                sx={{ padding: 0 }}
                onClick={handleDownVote}
                color={props.comment.userVote === "down" ? "error" : "default"}
              >
                <DownIcon fontSize="large" />
              </IconButton>
            </Stack>
          </Box>
          <Card
            style={{
              margin: 10,
              width: "100%",
            }}
          >
            <CardHeader
              sx={{ backgroundColor: "card.main" }}
              title={
                <Stack
                  spacing={0.5}
                  direction="row"
                  sx={{ alignItems: "center" }}
                >
                  {props.comment.hidden &&
                    (isModerator || props.role === "admin") && (
                      <Tooltip
                        title={<Typography>Hidden Comment</Typography>}
                        arrow
                      >
                        <VisibilityOffIcon />
                      </Tooltip>
                  )}
                  {props.comment.creatorIsModerator &&
                    props.comment.creatorIsModerator === true && (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            border: "solid 1px",
                            borderRadius: "10px",
                            p: 0.5,
                            mr: 0.5,
                          }}
                        >
                          Moderator
                        </Typography>
                      </Box>
                    )}
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
                </Stack>
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
                (props.userId === props.comment.creator ||
                  props.role === "admin") && (
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
                        {(props.userId === props.comment.creator ||
                          props.role === "admin") && (
                          <MenuItem onClick={handleDeleteCommentClick}>
                            <ListItemIcon>
                              <DeleteForeverTwoToneIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                          </MenuItem>
                        )}
                        {(props.userId === props.comment.creator ||
                          isModerator ||
                          props.role === "admin") && (
                          <MenuItem
                            onClick={() => {
                              setShowInput(true);
                              handleMenuClose();
                            }}
                          >
                            <ListItemIcon>
                              <EditTwoToneIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                          </MenuItem>
                        )}
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
            <CardContent
              sx={{
                paddingTop: "0px",
                backgroundColor: "card.main",
              }}
            >
              {props.comment.edits?.length > 0 && (
                <Typography variant="caption" color="#898989">
                  Edited: {editDate}
                </Typography>
              )}
              {showInput ? (
                <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                  <TextField
                    value={editedComment}
                    onChange={handleEditedCommentTextChange}
                    size="small"
                    label="Edit comment"
                    multiline
                    sx={{ width: "85%" }}
                    error={
                      !editedComment ||
                      (editedComment.length >= 3 &&
                        editedComment.length <= 1000)
                        ? false
                        : true
                    }
                    helperText="Comment must be 3-1000 characters in length."
                  />
                  <Button
                    variant="contained"
                    onClick={handleEditComment}
                    sx={{ height: 38 }}
                    disabled={
                      !(
                        editedComment.length >= 3 &&
                        editedComment.length <= 1000
                      )
                    }
                  >
                    Save Changes
                  </Button>
                </Stack>
              ) : (
                <Typography variant="body2">{props.comment.message}</Typography>
              )}
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
  role: state.auth.user.role,
  communities: state.communities.communities,
});

const mapDispatchToProps = {
  openDeleteCommentModal,
  openFlagCommentModal,
  upvoteComment,
  downvoteComment,
  editComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
