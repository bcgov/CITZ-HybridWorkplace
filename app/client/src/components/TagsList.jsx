import React from "react";
import { connect } from "react-redux";
import { tagPost, unTagPost } from "../redux/ducks/postDuck";
import Tag from "./Tag";

export const TagsList = (props) => {

  const getNumTags = (post, tag) => {
    try {
      return post.tags.filter(obj => obj.tag === tag)?.length
    } catch (err) {
      console.error(err)
    }
  }
  return props.post.availableTags ? (
    props.post.availableTags?.map((tag, index) => (
      <Tag
        name={tag}
        clicked={tag === props.post.userTag}
        postId={props.post._id}
        key={tag}
        tagPost={props.tagPost}
        unTagPost={props.unTagPost}
        numTags={getNumTags(props.post, tag)}
      />
    ))
  ) : (
    <div></div>
  );
};

const mapStateToProps = (state) => ({ auth: state.auth });

const mapDispatchToProps = { tagPost, unTagPost };

export default connect(mapStateToProps, mapDispatchToProps)(TagsList);
