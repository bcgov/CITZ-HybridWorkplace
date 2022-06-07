import React from "react";
import { connect } from "react-redux";
import { tagPost, unTagPost } from "../redux/ducks/postDuck";
import Tag from "./tag";

export const TagsList = (props) => {
  return props.post.availableTags ? (
    props.post.availableTags?.map((tag, index) => (
      <Tag
        name={tag}
        clicked={tag === props.post.userTag}
        postId={props.post._id}
        key={index}
        tagPost={props.tagPost}
        unTagPost={props.unTagPost}
      />
    ))
  ) : (
    <div></div>
  );
};

const mapStateToProps = (state) => ({ auth: state.auth });

const mapDispatchToProps = { tagPost, unTagPost };

export default connect(mapStateToProps, mapDispatchToProps)(TagsList);
