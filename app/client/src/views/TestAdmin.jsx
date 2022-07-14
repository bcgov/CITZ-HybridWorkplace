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
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import { useState } from "react";
import { Grid, Stack, Box, Typography, Divider, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";

import { connect } from "react-redux";

const StatusBox = (props) => {
  return (
    <Box
      sx={{
        my: 1,
        p: 1,
        borderRadius: 5,
        backgroundColor: "banner.main",
        boxShadow: "1px 2px 9px #454545",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <Stack>
        <Typography
          variant="h6"
          sx={{ color: "white", textAlign: "center", fontWeight: 600 }}
        >
          {props.title}: {props.value}
        </Typography>
        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            pb: 0.3,
          }}
        >
          Latest: Today, 12:00pm
        </Typography>
      </Stack>
    </Box>
  );
};

const TestAdmin = (props) => {
  const [tab, setTab] = useState("1");

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "Username",
      width: 150,
    },
    {
      field: "name",
      headerName: "Full Name",
      width: 150,
    },
    {
      field: "message",
      headerName: "Message",
      width: 270,
    },
  ];

  const rows = [
    {
      id: 1,
      username: "Snow",
      name: "Snow Jon",
      message: "My community is on fire.",
    },
    {
      id: 2,
      username: "Lannister",
      name: "Lannister Cersei",
      message: "My community is on fire.",
    },
    {
      id: 3,
      username: "Lannister",
      name: "Lannister Jaime",
      message: "My community is on fire.",
    },
    {
      id: 4,
      username: "Stark",
      name: "Stark Arya",
      message: "My community is on fire.",
    },
    {
      id: 5,
      username: "Targaryen",
      name: "Targaryen Daenerys",
      message: "My community is on fire.",
    },
    {
      id: 6,
      username: "Melisandre",
      name: "Melisandre Smith",
      message: "My community is on fire.",
    },
    {
      id: 7,
      username: "Clifford",
      name: "Clifford Ferrara",
      message: "My community is on fire.",
    },
    {
      id: 8,
      username: "Frances",
      name: "Frances Rossini",
      message: "My community is on fire.",
    },
    {
      id: 9,
      username: "Roxie",
      name: "Roxie Harvey",
      message: "My community is on fire.",
    },
  ];

  return (
    <Box sx={{ pb: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={2.5}>
          <Box
            mb="15px"
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "10px",
              color: "white",
              py: 0.5,
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Status
            </Typography>
          </Box>
          <Stack>
            <StatusBox title={"Direct Messages"} value={17} />
            <StatusBox title={"Flagged Communities"} value={2} />
            <StatusBox title={"Flagged Posts"} value={34} />
            <StatusBox title={"Flagged Comments"} value={49} />
          </Stack>
        </Grid>
        <Grid item xs={0.5} sx={{ justifyContent: "center", display: "flex" }}>
          <Divider orientation="vertical" variant="middle" />
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ width: "100%" }}>
            <TabContext value={tab}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <TabList onChange={handleTabChange}>
                  <Tab
                    label="Direct Messages"
                    value="1"
                    sx={{ fontWeight: 600 }}
                  />
                  <Tab label="Communities" value="2" sx={{ fontWeight: 600 }} />
                  <Tab label="Posts" value="3" sx={{ fontWeight: 600 }} />
                  <Tab label="Comments" value="4" sx={{ fontWeight: 600 }} />
                  <Tab label="Users" value="5" sx={{ fontWeight: 600 }} />
                  <Tab label="API Logs" value="6" sx={{ fontWeight: 600 }} />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                  />
                </Box>
              </TabPanel>
              <TabPanel value="2"></TabPanel>
              <TabPanel value="3"></TabPanel>
              <TabPanel value="4"></TabPanel>
              <TabPanel value="5"></TabPanel>
              <TabPanel value="6"></TabPanel>
            </TabContext>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TestAdmin);
