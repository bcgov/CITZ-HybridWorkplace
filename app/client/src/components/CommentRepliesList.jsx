import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import { getCommentReplies } from "../redux/ducks/commentDuck";
import Comment from "./Comment";
import ArrowDropDownTwoToneIcon from "@mui/icons-material/ArrowDropDownTwoTone";
import ArrowDropUpTwoToneIcon from "@mui/icons-material/ArrowDropUpTwoTone";
import { useTheme } from "@emotion/react";
export const CommentRepliesList = (props) => {
  const theme = useTheme();
  const [showReplies, setShowReplies] = useState(false);

  const getReplies = async () => {
    //If replies have already been fetched, dont fetch them again.
    if (!props.comment.replies?.length) {
      await props.getCommentReplies(props.comment._id);
    }
    setShowReplies(true);
  };
  const hideReplies = () => {
    setShowReplies(false);
  };

  return (
    <>
      {showReplies ? (
        <>
          <Grid container justifyContent="flex-end">
            {props.comment.replies?.map((reply, index) => (
              <Grid item xs={11} key={reply._id}>
                <Comment comment={reply} hideReply replyTo={props.comment._id} />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="text"
            onClick={hideReplies}
            sx={{ color: "button.main" }}
          >
            <ArrowDropUpTwoToneIcon />
            Hide Replies
          </Button>
        </>
      ) : (
        props.comment.hasReplies && (
          <Grid container justifyContent="flex-start">
            <Grid item>
              <Button
                variant="text"
                onClick={getReplies}
                sx={{ color: "button.main" }}
              >
                <ArrowDropDownTwoToneIcon />
                See Replies
              </Button>
            </Grid>
          </Grid>
        )
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getCommentReplies };

export default connect(mapStateToProps, mapDispatchToProps)(CommentRepliesList);
