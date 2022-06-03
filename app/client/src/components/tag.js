import React from "react";
import { connect } from "react-redux";

export const tag = (props) => {
  return <div>tag</div>;
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(tag);
