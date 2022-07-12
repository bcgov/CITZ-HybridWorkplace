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

import { Button, Grid, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";
import Image404 from "../layout/icons/404.png";

const Page404 = () => {
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
        <Typography variant="h3">Sorry, page not found.</Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={redirect}>
          Return Home
        </Button>
      </Grid>
      <Grid item>
        <Tooltip
          title={`Image taken from https://www.freepik.com/free-vector/error-404-concept-landing-page_4660894.htm#query=404%20page&position=1&from_view=keyword`}
        >
          <img style={{ maxWidth: "80vh" }} src={Image404} />
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default Page404;
