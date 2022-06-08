import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

export const DeleteCommunityModal = (props) => {
  return <div>DeleteCommunityModal</div>;
};

DeleteCommunityModal.propTypes = {
  second: PropTypes,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteCommunityModal);
