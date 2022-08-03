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

import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography, Tooltip } from "@mui/material";

const AdminStatusBox = (props) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (props.navigate) navigate(`/${props.navigate}`);
  };

  // Convert props.latest to local time
  let latest =
    moment(moment.utc(props.latest, "MMMM Do YYYY, h:mm:ss a").toDate())
      .local()
      .format("MMMM Do YYYY, h:mm:ss a") || "";
  // Remove milliseconds
  latest = `${latest.substring(0, latest.length - 6)} ${latest.substring(
    latest.length - 2,
    latest.length
  )}`;
  const splitLatest = latest.split(",");

  const today = moment().format("MMMM Do YYYY");
  const yesterday = moment().subtract(1, "days").format("MMMM Do YYYY");

  if (splitLatest[0] === today) latest = `Today${splitLatest[1]}`;
  if (splitLatest[0] === yesterday) latest = `Yesterday${splitLatest[1]}`;

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
        ":hover": {
          cursor: "pointer",
        },
      }}
      onClick={handleNavigate}
    >
      <Tooltip
        title={<Typography>Click to see most recently flagged.</Typography>}
        followCursor={true}
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
            Latest: {latest}
          </Typography>
        </Stack>
      </Tooltip>
    </Box>
  );
};

export default AdminStatusBox;
