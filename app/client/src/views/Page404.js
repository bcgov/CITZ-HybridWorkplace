import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

const Page404 = () => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/login");
  };
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3">404, Page not found.</Typography>
      </Grid>
      <br />
      <Button variant="contained" color="primary" onClick={redirect}>
        Return Home
      </Button>
    </Grid>
  );
};

export default Page404;
