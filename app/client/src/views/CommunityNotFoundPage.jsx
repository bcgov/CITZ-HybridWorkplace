//
// Copyright © 2022 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Application entry point
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @module
 */

import { Button, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

const Page404 = (props) => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/");
  };
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      spacing={6}
    >
      <Grid item>
        <Stack alignItems="center">
          <Typography variant="h3">
            Sorry, we couldn't find the community
          </Typography>

          <Typography variant="h3">
            {props.title.length >= 25
              ? props.title.substring(0, 25) + "..."
              : props.title}
          </Typography>
        </Stack>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={redirect}>
          Return Home
        </Button>
      </Grid>
      <Grid item>
        <Tooltip
          title={`Image taken from https://www.freepik.com/free-vector/illustration-human-avatar-using-technology_2801797.htm#query=not%20found&position=31&from_view=search`}
        >
          <img
            style={{ maxWidth: "60vh", maxHeight: "50vh" }}
            src="https://img.freepik.com/free-vector/illustration-human-avatar-using-technology_53876-17455.jpg?t=st=1657865021~exp=1657865621~hmac=1a8244040c964b8baa50b2cdd89c83536529039c64d598070cbe7aed79cd7075&w=826"
          />
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default Page404;
