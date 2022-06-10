import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { createComment } from "../redux/ducks/postDuck";

export const CreateComment = (props) => {
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleAddCommentButton = () => setShowCommentInput(true);

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
          <br />
          <Stack spacing={2} direction="row">
            <TextField
              value={commentText}
              onChange={handleCommentTextChange}
              size="small"
              label="Comment"
            />
            <Button variant="contained" onClick={handleCreateComment}>
              Post Comment
            </Button>
          </Stack>
        </>
      ) : (
        <Button onClick={handleAddCommentButton}>Add Comment</Button>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { createComment };

export default connect(mapStateToProps, mapDispatchToProps)(CreateComment);
