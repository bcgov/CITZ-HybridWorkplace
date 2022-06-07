import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { createError } from "../redux/ducks/alertDuck";
import PropTypes from "prop-types";

const PrivateComponent = (props) => {
  const isLoggedIn = props.accessToken !== "";
  if (!isLoggedIn) {
    props.createError(`Must log in before accessing page`);
  }
  return isLoggedIn ? props.component : <Navigate to="/login" />;
};

PrivateComponent.propTypes = {
  createError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ accessToken: state.auth.accessToken });

const mapActionsToProps = { createError };

export default connect(mapStateToProps, mapActionsToProps)(PrivateComponent);
