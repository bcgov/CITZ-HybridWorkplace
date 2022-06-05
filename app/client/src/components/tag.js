import { Chip } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { addTagToPost } from "../redux/ducks/postDuck";

export const Tag = (props) => {
  const [clicked, setClicked] = useState(props.clicked);
  const handleTagClick = () => {
    setClicked(!clicked);
  };

  const randomColor = () => {
    const colors = [
      "default",
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Chip
      label={props.name}
      color={props.color || randomColor()}
      variant={clicked ? "filled" : "outlined"}
      onClick={handleTagClick}
    ></Chip>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { addTagToPost };

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
