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
