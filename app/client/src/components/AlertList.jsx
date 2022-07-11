import { Alert, AlertTitle, Snackbar, Slide } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";

export const AlertList = ({ alerts }) => {
  const [open, setOpen] = useState();

  useEffect(() => {
    setOpen(true);
  }, [alerts]);

  const handleClose = () => {
    setOpen(false);
  };

  function TransitionRight(props) {
    return <Slide {...props} direction="right" />;
  }
  return (
    <div
      style={{
        height: "100vh",
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 501,
      }}
    >
      {alerts.errors.map((element, index) => (
        <Snackbar
          open={open}
          autoHideDuration={10000}
          TransitionComponent={TransitionRight}
        >
          <Alert
            variant="filled"
            severity="error"
            key={index + element}
            onClose={handleClose}
            sx={{ mb: 8 }}
          >
            <AlertTitle>Error</AlertTitle>
            {element}
          </Alert>
        </Snackbar>
      ))}
      {alerts.warnings.map((element, index) => (
        <Snackbar
          open={open}
          autoHideDuration={10000}
          TransitionComponent={TransitionRight}
        >
          <Alert
            variant="filled"
            severity="warning"
            key={index + element}
            onClose={handleClose}
            sx={{ mb: 8 }}
          >
            <AlertTitle>Warning</AlertTitle>
            {element}
          </Alert>
        </Snackbar>
      ))}
      {alerts.successes.map((element, index) => (
        <Snackbar
          open={open}
          autoHideDuration={10000}
          TransitionComponent={TransitionRight}
        >
          <Alert
            variant="filled"
            severity="success"
            key={index + element}
            onClose={handleClose}
            sx={{ mb: 8 }}
          >
            <AlertTitle>Success</AlertTitle>
            {element}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({ alerts: state.alerts });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AlertList);
