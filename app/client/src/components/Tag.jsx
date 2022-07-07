import React, { useState } from "react";
import { Badge, Chip } from "@mui/material";
import { connect } from "react-redux";

export const Tag = (props) => {
  const [clicked, setClicked] = useState(props.clicked);
  const [tagCount, setTagCount] = useState(props.numTags);
  const [loading, setLoading] = useState(false);

  const handleRemoveTag = async () => {
    setLoading(true);
    const successful = await props.unTagPost(props.postId, props.name);
    if (successful === true) {
      setTagCount((prev) => prev - 1);
      setClicked(false);
    }
    setLoading(false);
  };

  const handleTagPost = async () => {
    setLoading(true);
    const successful = await props.tagPost(props.postId, props.name);

    if (successful === true) {
      setTagCount((prev) => prev + 1);
      setClicked(true);
    }
    setLoading(false);
  };

  const randomColor = () => {
    const colors = [
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const color = useState(randomColor())[0];

  return (
    <Badge badgeContent={tagCount} color="error">
      <Chip
        label={props.name}
        color={props.color || color}
        variant={clicked ? "filled" : "outlined"}
        onClick={clicked ? handleRemoveTag : handleTagPost}
        disabled={loading}
      ></Chip>
    </Badge>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
