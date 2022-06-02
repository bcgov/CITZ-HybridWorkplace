import { Alert } from "@mui/material";
import React from "react";
import { connect } from "react-redux";

export const AlertList = ({ alerts }) => {
  return (
    <div
      style={{
        height: "100vh",
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 1,
      }}
    >
      {alerts.errors.map((element) => (
        <Alert severity="error">{element}</Alert>
      ))}
      {alerts.warnings.map((element) => (
        <Alert severity="warning">{element}</Alert>
      ))}
      {alerts.successes.map((element) => (
        <Alert severity="success">{element}</Alert>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({ alerts: state.alerts });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AlertList);
