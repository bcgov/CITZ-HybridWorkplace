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
import {
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import "./Styles/about.css";

const AboutPage = () => {
  return (
    <Box>
      <Stack spacing={2} sx={{ pb: 1 }}>
        <Typography variant="h4">Hybrid Workplace: The Neigbourhood</Typography>
        <Typography variant="body1">
          Is a collaboration tool for internal government communities as per our
          problem statement
        </Typography>
        <Typography variant="body1">VERSION.BUILD v.1.0.1</Typography>
      </Stack>

      <Grid container spacing={10}>
        <Grid item xs={5.5}>
          <Stack spacing={1}>
            <Typography variant="h5">Platform:</Typography>

            <Typography>
              Developed using React.js, Node.js, MongoDB and Express hosted on
              OpenShift.
            </Typography>
          </Stack>
          <Stack sx={{ marginTop: 2 }}>
            <Typography variant="h5">Features Include:</Typography>
            <ul>
              <li>
                <Typography variant="body1">User Account Managmanet</Typography>
              </li>
              <ul>
                <li>
                  <Typography variant="body1">Registration</Typography>
                </li>
                <li>
                  <Typography variant="body1">Login/Logout</Typography>
                </li>
              </ul>
              <li>
                <Typography variant="body1">Community Collaboration</Typography>
              </li>
              <ul>
                <li>
                  <Typography variant="body1">Create a Community</Typography>
                </li>
                <li>
                  <Typography variant="body1">Delete your Community</Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Join / Leave a Community
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">List all Communities</Typography>
                </li>
              </ul>
              <li>
                <Typography variant="body1">Posts</Typography>
              </li>
              <ul>
                <li>
                  <Typography variant="body1">
                    Create a Post in a Community
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">Delete Your Post</Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Flag Post For Misconduct
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">Tag Post</Typography>
                </li>
              </ul>
              <li>
                <Typography variant="body1">APIs</Typography>
              </li>
              <br />
              <br />
            </ul>
          </Stack>
        </Grid>
        <Grid item xs={5.5}>
          <Typography variant="h5" sx={{ pb: 1 }}>
            {" "}
            Developed By:
          </Typography>
          <Typography variant="h6">Phase 1:</Typography>
          <Typography variant="subtitle1">UVIC Co-op</Typography>
          <Divider />
          <List>
            <ListItem>
              <Typography variant="body2">
                Abby: a.ulveland@gmail.com
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                Jayna: bettesworthjayna@gmail.com
              </Typography>
            </ListItem>
          </List>
          <Stack>
            <Typography variant="h6">Phase 2:</Typography>
            <Typography variant="subtitle1">Camosun Capstone</Typography>
          </Stack>
          <Divider />
          <List>
            <ListItem>
              <Typography variant="body2">
                Zach: zachbourque01@gmail.com
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                Brady: braden.jr.mitch@gmail.com
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                Brandon: brandonjbouchard@gmail.com
              </Typography>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <Typography variant="body1" sx={{ pb: 10 }}>
        This project is open sourced for fair use, with attribution. This work
        carried no warranty or implied guarantee. All third party libraries are
        those of their rightful owners or licenses. BC government theme © 2020
        by the Government of BC
      </Typography>
    </Box>
  );
};

export default AboutPage;
