import { Chip } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { tagPost } from "../redux/ducks/postDuck";

export const Tag = (props) => {
  const [clicked, setClicked] = useState(props.clicked);
  const handleTagClick = () => {
    setClicked(!clicked);
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

  const color = randomColor();

  return (
    <Chip
      label={props.name}
      color={props.color || color}
      variant={clicked ? "filled" : "outlined"}
      onClick={handleTagClick}
    ></Chip>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { tagPost };

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
