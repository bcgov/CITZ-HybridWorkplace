import { Chip } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { addTagToPost } from "../redux/ducks/postDuck";

export const tag = (props) => {
  const [clicked, setClicked] = useState(false);
  const handleTagClick = () => {
    setClicked(!clicked);
  };

  return (
    <Chip
      label={props.name}
      color={props.color || "primary"}
      variant={clicked ? "filled" : "outlined"}
      onClick={handleTagClick}
    ></Chip>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { addTagToPost };

export default connect(mapStateToProps, mapDispatchToProps)(tag);
