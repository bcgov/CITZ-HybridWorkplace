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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { closeFlagPostModal, flagPost } from "../../redux/ducks/flagDuck";
import PropTypes from "prop-types";
import { useState } from "react";

const FlagPost = (props) => {
  //TODO: Get list of flags from API
  const flags = [
    "Inappropriate",
    "Hate",
    "Harassment or Bullying",
    "Spam",
    "Misinformation",
    "Against Community Rules",
  ];
  const [flag, setFlag] = useState("");

  const handleFlagChange = (event) => setFlag(event.target.value);

  const handleFlagPost = async () => {
    const successful = await props.flagPost(props.post._id, flag);
    if (successful === true) {
      props.closeFlagPostModal();
    }
  };

  return (
    <Dialog onClose={props.closeFlagPostModal} open={props.open} fullWidth="md">
      <DialogTitle>Flag Post</DialogTitle>
      <DialogContent>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Grid item xs={12}>
            <Typography variant="h4">
              Flagging Post: {props.post.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="demo-simple-select-standard-label">Flag</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={flag}
              onChange={handleFlagChange}
              label="Flag"
            >
              {flags.map((element) => (
                <MenuItem value={element}>{element}</MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFlagPost} variant="contained" color="error">
          Flag Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FlagPost.propTypes = {
  open: PropTypes.bool,
  closeFlagPostModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  open: state.flags.flagPost.open,
  post: state.flags.flagPost.post,
});

const mapActionsToProps = {
  closeFlagPostModal,
  flagPost,
};

export default connect(mapStateToProps, mapActionsToProps)(FlagPost);
