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

import { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  Grid,
  Stack,
  Box,
  Typography,
  Divider,
  Tab,
  TextField,
  Button,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AdminStatusBox from "../components/AdminStatusBox";
import { getAdminData } from "../redux/ducks/adminDuck";
import { DataGrid } from "@mui/x-data-grid";
import LoadingPage from "./LoadingPage";
import { Navigate } from "react-router-dom";
import {
  openAdminDeleteUserModal,
  openAdminEditUserInfoModal,
} from "../redux/ducks/modalDuck";
import AdminDeleteUserModal from "../components/modals/AdminDeleteUserModal";
import AdminEditUserModal from "../components/modals/AdminEditUserModal";

const AdminPage = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await props.getAdminData();
      setLoading(false);
    })();
  }, []);

  // TABS
  const [tab, setTab] = useState(1);
  const handleTabChange = (event, newValue) => {
    // event is required
    setTab(newValue);
  };

  // USER
  const [selectedUser, setSelectedUser] = useState("");
  const onSelectedUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  /**
   * Get Data Grid columns and rows
   * for GET /api/user/dataGrid
   * returns { columns, rows }
   */

  /**
   * GET - Get user by username and return pure object or map of objects properties in modal.
   * EDIT - Open modal to set fields to edit on user.
   * DELETE - Permanently delete user. Warning and confirmation modal
   * like how github prompts deleting a repository.
   */

  return !props.userIsAdmin ? (
    <Navigate to="/" />
  ) : (
    <Grid container spacing={2} sx={{ pb: 10 }}>
      <Grid item xs={3}>
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
            variant="h6"
            sx={{
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Status
          </Typography>
        </Box>
        <Stack>
          <AdminStatusBox title={"Flagged Communities"} value={2} />
          <AdminStatusBox title={"Flagged Posts"} value={34} />
          <AdminStatusBox title={"Flagged Comments"} value={49} />
        </Stack>
      </Grid>
      <Grid item xs={0.5} sx={{ justifyContent: "center", display: "flex" }}>
        <Divider orientation="vertical" variant="middle" />
      </Grid>
      <Grid item xs={8.5}>
        <Box sx={{ width: "100%" }}>
          <TabContext value={tab}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <TabList onChange={handleTabChange}>
                <Tab label="Users" value={1} sx={{ fontWeight: 600 }} />
                <Tab label="Communities" value={2} sx={{ fontWeight: 600 }} />
                <Tab label="Posts" value={3} sx={{ fontWeight: 600 }} />
                <Tab label="Comments" value={4} sx={{ fontWeight: 600 }} />
              </TabList>
            </Box>
            <TabPanel value={1}>
              <Box sx={{ height: 350, width: "100%" }}>
                <DataGrid
                  rows={[]}
                  columns={[]}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                />
                <Stack spacing={1.5} direction="row" sx={{ my: 2 }}>
                  <TextField
                    placeholder="Enter username"
                    value={selectedUser}
                    onChange={onSelectedUserChange}
                    fullWidth
                  />
                  <Button>Get</Button>
                  {/* //TO BE REPLACED WITH ACTUAL USER DATA*/}
                  <Button
                    onClick={() => props.openAdminEditUserInfoModal(props.user)}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => props.openAdminDeleteUserModal(props.user)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
            <TabPanel value={2}>
              <Box sx={{ height: 400, width: "100%" }}></Box>
            </TabPanel>
            <TabPanel value={3}>
              <Box sx={{ height: 400, width: "100%" }}></Box>
            </TabPanel>
            <TabPanel value={4}>
              <Box sx={{ height: 400, width: "100%" }}></Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
      <AdminDeleteUserModal />
      <AdminEditUserModal />
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  adminData: state.admin,
  userIsAdmin: state.auth.user.role === "admin",
  //TO BE REPLACED WITH ACTUAL USER DATA
  user: state.auth.user,
});

const mapDispatchToProps = {
  getAdminData,
  openAdminDeleteUserModal,
  openAdminEditUserInfoModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
