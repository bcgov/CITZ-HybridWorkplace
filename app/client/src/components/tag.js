import { Chip } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";

export const Tag = (props) => {
  const [clicked, setClicked] = useState(props.clicked);

  const handleRemoveTag = async () => {
    setClicked(false);
    const successful = await props.unTagPost(props.postId, props.name);
    if (!successful) {
      setClicked(true);
    }
  };

  const handleTagPost = async () => {
    setClicked(true);
    const successful = await props.tagPost(props.postId, props.name);
    if (!successful) {
      setClicked(false);
    }
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
    <Chip
      label={props.name}
      color={props.color || color}
      variant={clicked ? "filled" : "outlined"}
      onClick={clicked ? handleRemoveTag : handleTagPost}
    ></Chip>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
