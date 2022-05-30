import MuiAlert from "@mui/material/Alert";
import { forwardRef, useState } from "react";
import { connect } from "react-redux";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Alerts = (props) => {
  return (
    <div style={{ position: "fixed", bottom: 0, height: "100vh" }}>
      {props.alerts.errors.map((item) => (
        <Alert severity="error">{item}</Alert>
      ))}
      {props.alerts.warnings.map((item) => (
        <Alert severity="warning">{item}</Alert>
      ))}
      {props.alerts.successes.map((item) => (
        <Alert severity="success">{item}</Alert>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({ alerts: state.alerts });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
