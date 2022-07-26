import React, { useEffect } from "react";
import { connect } from "react-redux";
import Comment from "./Comment";
import { getComments } from "../redux/ducks/commentDuck";
import DeleteCommentModal from "./modals/DeleteCommentModal";
import FlagCommentModal from "./modals/FlagCommentModal";
export const CommentsList = (props) => {
  useEffect(() => {
    props.comments?.length || props.getComments(props.postId);
  }, []);
  return (
    <>
      {props.comments?.map((comment) => (
        <Comment comment={comment} key={comment._id} />
      ))}
      <DeleteCommentModal />
      <FlagCommentModal />
    </>
  );
};

const mapStateToProps = (state) => ({
  comments: state.posts.items[state.posts.currentPostIndex]?.comments ?? [],
  postId: state.posts.items[state.posts.currentPostIndex]?._id ?? "",
});

const mapDispatchToProps = { getComments };

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList);
