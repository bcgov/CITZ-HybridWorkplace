import React, { useEffect } from "react";
import { connect } from "react-redux";
import Comment from "./Comment";
import { getComments } from "../redux/ducks/postDuck";

export const CommentsList = (props) => {
  useEffect(() => {
    props.getComments(props.postId);
  }, []);
  return (
    props.comments?.map((comment) => <Comment comment={comment} />) || (
      <p>This post has no comments.</p>
    )
  );
};

const mapStateToProps = (state) => ({
  postId: state.posts.item._id,
  comments: state.posts.item.comments,
});

const mapDispatchToProps = { getComments };

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList);
