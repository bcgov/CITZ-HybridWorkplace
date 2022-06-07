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
 * @author [Zach Bourque](bettesworthjayna@gmail.com)
 * @module
 */

import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import CreateCommunity from "../CreateCommunity";

const AddCommunityModal = (props) => {
  return (
    <Dialog onClose={props.onClose} open={props.open} fullWidth="md">
      <DialogTitle>Create a Community</DialogTitle>
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <CreateCommunity onClose={props.onClose} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommunityModal;
