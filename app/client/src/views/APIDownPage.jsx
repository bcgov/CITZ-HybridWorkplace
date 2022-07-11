import { Box, Grid, Typography, Stack, Tooltip } from "@mui/material";
import React from "react";

function APIDownPage() {
  //TODO: Re-call the API ever X seconds to automatically redirect the user if the API is up

  return (
    <Stack
      alignItems="center"
      justifyContent="space-around"
      style={{ height: "85vh" }}
      spacing={2}
    >
      <Stack alignItems="center" spacing={2}>
        <Typography variant="h4">
          Sorry, HWP is down for maintenance.
        </Typography>
        <Typography variant="h6">Please check back soon.</Typography>
      </Stack>
      <Tooltip
        title={`Image taken from https://www.freepik.com/free-vector/construction-team-working-site_7416538.htm#query=construction%20illustration&position=1&from_view=search`}
      >
        <img
          style={{ maxWidth: "80vh" }}
          src="https://img.freepik.com/free-vector/construction-team-working-site_74855-4775.jpg?t=st=1656390254~exp=1656390854~hmac=1ae8937f836c69c3df9c3a9ebb9e241c4387f95db6f3352a54faf4fc261a17b1&w=1380"
        />
      </Tooltip>
    </Stack>
  );
}

export default APIDownPage;
