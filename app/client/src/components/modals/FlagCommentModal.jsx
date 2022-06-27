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
 * @author [Zach Bourque](zachbourque01@gmail.com)
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
  Stack,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { closeFlagCommentModal } from "../../redux/ducks/modalDuck";
import { flagComment } from "../../redux/ducks/postDuck";
import PropTypes from "prop-types";
import { useState } from "react";

const FlagCommentModal = (props) => {
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

  const handleFlagComment = async () => {
    const successful = await props.flagComment(props.comment._id, flag);
    if (successful === true) {
      props.closeFlagCommentModal();
    }
  };

  return (
    <Dialog
      onClose={props.closeFlagCommentModal}
      open={props.open}
      fullWidth
      sx={{ zIndex: 500 }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Flag Comment
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="h6">{props.comment.message}</Typography>
          <Stack spacing={0.5}>
            <InputLabel id="demo-simple-select-standard-label">Flag</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
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

          <DialogActions sx={{ m: 0, pb: 0 }}>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                onClick={handleFlagComment}
                variant="contained"
                color="error"
              >
                Flag Comment
              </Button>
              <Button onClick={props.closeFlagCommentModal} variant="contained">
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

FlagCommentModal.propTypes = {
  open: PropTypes.bool,
  closeFlagCommentModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  open: state.modal.flagComment.open,
  comment: state.modal.flagComment.comment,
});

const mapActionsToProps = {
  closeFlagCommentModal,
  flagComment,
};

export default connect(mapStateToProps, mapActionsToProps)(FlagCommentModal);
