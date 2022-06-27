/* 
 Copyright © 2022 Province of British Columbia

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Application entry point
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import { useState } from "react";
import Communities from "../components/CommunitiesList";
import UsersCommunitiesList from "../components/UsersCommunitiesList";
import AddCommunityModal from "../components/modals/AddCommunityModal";

import { Button, Grid, Typography, Paper, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const CommunitiesPage = () => {
  const [createCommunityOpen, setCreateCommunityOpen] = useState(false);

  const openDialog = () => {
    setCreateCommunityOpen(true);
  };

  const closeDialog = (value) => {
    setCreateCommunityOpen(false);
  };

  return (
    <Box sx={{ pb: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box
            mb="15px"
            sx={{
              backgroundColor: "#036",
              borderRadius: "10px",
              color: "white",
              px: 1,
              py: 0.5,
              textAlign: "center",
              display: "flex",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={9}>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "center",
                    fontWeight: 600,
                    pl: "9em",
                  }}
                >
                  Top Communities
                </Typography>
              </Grid>
              <Grid
                item
                xs={3}
                align="right"
                sx={{
                  p: 0,
                  m: 0,
                }}
              >
                <Button onClick={openDialog}>
                  <Typography color="white">New</Typography>
                  <AddIcon sx={{ color: "white" }} />
                </Button>
              </Grid>
            </Grid>

            <AddCommunityModal
              onClose={closeDialog}
              open={createCommunityOpen}
            />
          </Box>
          <Communities />
        </Grid>
        <Grid item xs={4}>
          <Box
            mb="15px"
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "10px",
              color: "white",
              px: 1,
              py: 0.8,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              component="h5"
              sx={{
                fontWeight: 600,
              }}
            >
              My Communities
            </Typography>
          </Box>
          <UsersCommunitiesList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommunitiesPage;
