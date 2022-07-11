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
  Stack,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { closeFlagPostModal } from "../../redux/ducks/modalDuck";
import { flagPost } from "../../redux/ducks/postDuck";
import PropTypes from "prop-types";
import { useState } from "react";

const FlagPostModal = (props) => {
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
    <Dialog
      onClose={props.closeFlagPostModal}
      open={props.open}
      sx={{ zIndex: 500 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Flag Post</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack spacing={0.5}>
            <InputLabel id="demo-simple-select-standard-label">Flag</InputLabel>
            <Select
              id="demo-simple-select-standard"
              value={flag}
              onChange={handleFlagChange}
            >
              {flags.map((element) => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <DialogActions>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                onClick={handleFlagPost}
                variant="contained"
                color="error"
              >
                Flag Post
              </Button>
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                onClick={props.closeFlagPostModal}
              >
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

FlagPostModal.propTypes = {
  open: PropTypes.bool,
  closeFlagPostModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  open: state.modal.flagPost.open,
  post: state.modal.flagPost.post,
});

const mapActionsToProps = {
  closeFlagPostModal,
  flagPost,
};

export default connect(mapStateToProps, mapActionsToProps)(FlagPostModal);
