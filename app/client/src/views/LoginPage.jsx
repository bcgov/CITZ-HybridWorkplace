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

import { Button, Grid, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { connect } from "react-redux";
import BCLogo from "../layout/icons/BC-government-logo-NEW.jpg";
import { useTheme } from "@emotion/react";
import MarkEmailUnreadTwoToneIcon from "@mui/icons-material/MarkEmailUnreadTwoTone";
import GroupsTwoToneIcon from "@mui/icons-material/GroupsTwoTone";
import { login } from "../redux/ducks/authDuck";
/**
 * Application entry point
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
 * @module
 */

function LoginPage(props) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const onLoginClick = () => {
    props.login();
  };

  return (
    <div
      style={{
        width: "100vw",
        top: "71px",
        left: 0,
        position: "absolute",
      }}
    >
      <Stack spacing={6}>
        <Box
          sx={{
            backgroundColor: isDarkMode
              ? "rgba(0, 51, 102, .75)"
              : "rgba(220, 220, 220, .5)",
            minHeight: "45vh",
            borderBottomLeftRadius: "70% 10%",
            borderBottomRightRadius: "70% 10%",
            boxShadow: "none !important",
          }}
        >
          <Stack>
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={8}
              sx={{ paddingTop: 10 }}
            >
              <Stack>
                <Typography variant="h3" align="center">
                  Welcome to
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    color: isDarkMode
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                  }}
                  align="center"
                >
                  The Neighbourhood
                </Typography>
                <Typography variant="h6" align="center">
                  BCGov's Hybrid Workplace Solution
                </Typography>
              </Stack>

              <Stack spacing={1} sx={{ paddingBottom: 5 }}>
                <Typography variant="body1" align="right">
                  Have IDIR?
                </Typography>

                <Button
                  variant="contained"
                  onClick={onLoginClick}
                  color={isDarkMode ? "secondary" : "primary"}
                >
                  Login
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
        <Grid
          container
          justifyContent="space-around"
          alignItems="space-around"
          direction="row"
        >
          <Grid item xs={12} md={4}>
            <Stack alignItems="center" spacing={2}>
              <MarkEmailUnreadTwoToneIcon fontSize="large" />
              <Stack>
                <Typography variant="h5" align="center">
                  {"Receive custom email"}
                </Typography>
                <Typography variant="h5" align="center">
                  {"digests at the timing"}
                </Typography>
                <Typography variant="h5" align="center">
                  {"of your choice."}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack alignItems="center" spacing={2}>
              <img
                src={BCLogo}
                style={{ maxWidth: "50px", borderRadius: "50%" }}
              />
              <Stack>
                <Typography variant="h5" align="center">
                  {"Created specifically for"}
                </Typography>{" "}
                <Typography variant="h5" align="center">
                  {"BC Government employees."}
                </Typography>{" "}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4} sx={{ paddingBottom: "10%" }}>
            <Stack alignItems="center" spacing={2}>
              <GroupsTwoToneIcon fontSize="large" />
              <Stack>
                <Typography variant="h5" align="center">
                  {"Learn best practices and"}
                </Typography>
                <Typography variant="h5" align="center">
                  {"interact with experts in"}
                </Typography>
                <Typography variant="h5" align="center">
                  {"topic-specific communities."}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}

export default connect(null, { login })(LoginPage);
