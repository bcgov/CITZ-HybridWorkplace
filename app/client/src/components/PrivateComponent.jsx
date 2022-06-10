import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { createError } from "../redux/ducks/alertDuck";
import { getAccessToken } from "../redux/ducks/authDuck";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { CircularProgress, Grid } from "@mui/material";

const PrivateComponent = (props) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(props.accessToken !== "");
  useEffect(() => {
    (async () => {
      if (loggedIn) {
        setLoading(false);
      } else {
        const successful = await props.getAccessToken();
        setLoggedIn(successful);
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <CircularProgress color="primary" />
  ) : loggedIn ? (
    props.component
  ) : (
    <Navigate to="/login" />
  );
};

PrivateComponent.propTypes = {
  createError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ accessToken: state.auth.accessToken });

const mapActionsToProps = { createError, getAccessToken };

export default connect(mapStateToProps, mapActionsToProps)(PrivateComponent);
