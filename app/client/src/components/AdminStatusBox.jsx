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

import { Box, Stack, Typography } from "@mui/material";

const AdminStatusBox = (props) => {
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

export default AdminStatusBox;
