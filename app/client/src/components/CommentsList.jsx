import React, { useEffect } from "react";
import { connect } from "react-redux";
import Comment from "./Comment";
import { getComments } from "../redux/ducks/postDuck";
import DeleteCommentModal from "./modals/DeleteCommentModal";

export const CommentsList = (props) => {
  useEffect(() => {
    props.comments || props.getComments(props.postId);
  }, []);
  return (
    <>
      {props.comments?.map((comment) => <Comment comment={comment} />) || (
        <p>This post has no comments.</p>
      )}
      <DeleteCommentModal />
    </>
  );
};

const mapStateToProps = (state) => ({
  postId: state.posts.item._id,
  comments: state.posts.item.comments,
});

const mapDispatchToProps = { getComments };

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList);
