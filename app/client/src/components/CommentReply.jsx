import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { replyToComment } from "../redux/ducks/postDuck";

export const CommentReply = (props) => {
  const [replyValue, setReplyValue] = useState("");
  const onReplyValueChange = (e) => {
    setReplyValue(e.target.value);
  };
  const handleReply = async () => {
    const successful = await props.replyToComment(props.commentId, replyValue);
    if (successful) {
      props.close();
    }
  };
  return (
    <>
      <Grid
        container
        justifyContent="flex-end"
        spacing={1}
        sx={{ marginTop: 1 }}
      >
        <Grid item xs={0.7}>
          <Avatar src="https://source.unsplash.com/random/150×150/?profile%20picture" />
        </Grid>
        <Grid item xs={11.3}>
          <TextField
            size="small"
            fullWidth
            label="Add a reply"
            multiline
            onChange={onReplyValueChange}
            value={replyValue}
          />
        </Grid>
        <Grid item>
          <Button variant="text" onClick={props.close}>
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleReply}>
            Reply
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { replyToComment };

export default connect(mapStateToProps, mapDispatchToProps)(CommentReply);
