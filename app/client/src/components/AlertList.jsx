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
      {alerts.errors.map((element, index) => (
        <Alert severity="error" key={index + element}>
          {element}
        </Alert>
      ))}
      {alerts.warnings.map((element, index) => (
        <Alert severity="warning" key={index + element}>
          {element}
        </Alert>
      ))}
      {alerts.successes.map((element, index) => (
        <Alert severity="success" key={index + element}>
          {element}
        </Alert>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({ alerts: state.alerts });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AlertList);
