import React from "react";
import { connect } from "react-redux";
import Tag from "./tag";

export const TagsList = (props) => {
  return props.post.availableTags ? (
    props.post.availableTags?.map((tag) => (
      <Tag
        name={tag}
        clicked={props.post.tags.find(
          (element) =>
            element.tag === tag &&
            element.taggedBy[0] === "62995f76382a7c7988075ac7"
        )}
      />
    ))
  ) : (
    <div></div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TagsList);
