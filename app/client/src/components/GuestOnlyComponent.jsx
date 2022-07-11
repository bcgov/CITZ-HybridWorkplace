import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { createError } from "../redux/ducks/alertDuck";
import { getAccessToken } from "../redux/ducks/authDuck";
import PropTypes from "prop-types";
import { useEffect } from "react";
import LoadingPage from "../views/LoadingPage";

const GuestOnlyComponent = (props) => {
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
    <LoadingPage />
  ) : loggedIn ? (
    <Navigate to="/" />
  ) : (
    props.component
  );
};

GuestOnlyComponent.propTypes = {
  createError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ accessToken: state.auth.accessToken });

const mapActionsToProps = { createError, getAccessToken };

export default connect(mapStateToProps, mapActionsToProps)(GuestOnlyComponent);
