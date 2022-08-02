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
 * @author [Zach Bourque](bettesworthjayna@gmail.com)
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
  openAdminGetUserModal,
} from "../redux/ducks/modalDuck";
import AdminDeleteUserModal from "../components/modals/AdminDeleteUserModal";
import AdminEditUserModal from "../components/modals/AdminEditUserModal";
import AdminGetUserModal from "../components/modals/AdminGetUserModal";

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

  const handleDeleteUserClick = () => {
    if (selectedUser !== "") props.openAdminDeleteUserModal(selectedUser);
  };

  const handleEditUserClick = () => {
    if (selectedUser !== "") props.openAdminEditUserInfoModal(selectedUser);
  };

  const handleGetUserClick = () => {
    if (selectedUser !== "") props.openAdminGetUserModal(selectedUser);
  };

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
          {props.adminData.status.communities.flagCount > 0 && (
            <AdminStatusBox
              title={"Flagged Communities"}
              value={props.adminData.status.communities.flagCount}
              latest={props.adminData.status.communities.latest}
            />
          )}
          {props.adminData.status.posts.flagCount > 0 && (
            <AdminStatusBox
              title={"Flagged Posts"}
              value={props.adminData.status.posts.flagCount}
              latest={props.adminData.status.posts.latest}
            />
          )}
          {props.adminData.status.comments.flagCount > 0 && (
            <AdminStatusBox
              title={"Flagged Comments"}
              value={props.adminData.status.comments.flagCount}
              latest={props.adminData.status.comments.latest}
            />
          )}
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
                  rows={props.adminData.users.rows ?? []}
                  columns={props.adminData.users.columns ?? []}
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
                  <Button onClick={handleGetUserClick}>Get</Button>
                  <Button onClick={handleEditUserClick}>Edit</Button>
                  <Button onClick={handleDeleteUserClick}>Delete</Button>
                </Stack>
              </Box>
            </TabPanel>
            <TabPanel value={2}>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={props.adminData.communities.rows ?? []}
                  columns={props.adminData.communities.columns ?? []}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                />
              </Box>
            </TabPanel>
            <TabPanel value={3}>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={props.adminData.posts.rows ?? []}
                  columns={props.adminData.posts.columns ?? []}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                />
              </Box>
            </TabPanel>
            <TabPanel value={4}>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={props.adminData.comments.rows ?? []}
                  columns={props.adminData.comments.columns ?? []}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                />
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
      <AdminDeleteUserModal />
      <AdminEditUserModal />
      <AdminGetUserModal />
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
  openAdminGetUserModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
