import { CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../redux/ducks/authDuck";
import { useNavigate } from "react-router-dom";

export const LogoutPage = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await props.logout();
      navigate("/login");
      document.location.reload();
    })();
  }, []);
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      spacing={6}
    >
      <Grid item>
        <Typography variant="h5">Logging Out...</Typography>
      </Grid>
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);
