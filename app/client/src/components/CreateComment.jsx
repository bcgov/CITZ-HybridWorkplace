import { Avatar, Button, Grid, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { createComment } from "../redux/ducks/postDuck";

export const CreateComment = (props) => {
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleAddCommentButton = () => setShowCommentInput(true);
  const handleCancelButton = () => {
    setShowCommentInput(false);
    setCommentText("");
  };

  const handleCommentTextChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCreateComment = async () => {
    const successful = await props.createComment(props.post, commentText);
    if (successful) {
      setShowCommentInput(false);
      setCommentText("");
    }
  };
  return (
    <>
      {showCommentInput ? (
        <>
          <Grid container spacing={2} direction="row" justifyContent="right">
            <Grid item xs={0.7}>
              <Avatar src="https://source.unsplash.com/random/150×150/?profile%20picture" />
            </Grid>
            <Grid item xs={11.3}>
              <TextField
                value={commentText}
                onChange={handleCommentTextChange}
                size="small"
                label="Add a comment"
                multiline
                fullWidth
                error={
                  !commentText ||
                  (commentText.length >= 3 && commentText.length <= 1000)
                    ? false
                    : true
                }
                helperText="Comment must be 3-1000 characters in length."
                required
              />
            </Grid>
            <Grid item>
              <Button variant="text" onClick={handleCancelButton}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleCreateComment}>
                Comment
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Button onClick={handleAddCommentButton}>+ Add Comment</Button>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { createComment };

export default connect(mapStateToProps, mapDispatchToProps)(CreateComment);
