import React from "react";
import { connect } from "react-redux";
import { tagPost, unTagPost } from "../redux/ducks/postDuck";
import Tag from "./Tag";

export const TagsList = (props) => {
  return props.post.availableTags ? (
    props.post.availableTags?.map((tag, index) => (
      <Tag
        name={tag}
        clicked={
          !!props.post.tags.find(
            (element) =>
              element.tag === tag && element.taggedBy[0] === props.auth.user.id
          )
        }
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
