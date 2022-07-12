import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { replyToComment } from "../redux/ducks/postDuck";
import { getUser } from "../redux/ducks/userDuck";
import AvatarIcon from "./AvatarIcon";

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
          <AvatarIcon
            type={props.user.avatar?.avatarType ?? ""}
            initials={props.user?.initials ?? ""}
            image={props.user.avatar?.image ?? ""}
            gradient={props.user.avatar?.gradient ?? ""}
            colors={props.user.avatar?.colors ?? {}}
            size={50}
          />
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
          <Button
            variant="text"
            onClick={props.close}
            sx={{ color: "button.main" }}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleReply}
            sx={{ color: "button.main" }}
          >
            Reply
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => ({ user: state.self.user });

const mapDispatchToProps = { replyToComment, getUser };

export default connect(mapStateToProps, mapDispatchToProps)(CommentReply);
