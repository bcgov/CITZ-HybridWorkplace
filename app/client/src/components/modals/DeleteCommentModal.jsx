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
  Stack,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { closeDeleteCommentModal } from "../../redux/ducks/modalDuck";
import { deleteComment } from "../../redux/ducks/commentDuck";
import PropTypes from "prop-types";

const DeleteCommentModal = (props) => {
  const handleDeleteComment = async () => {
    const successful = await props.deleteComment(props.comment._id);
    if (successful === true) {
      props.closeDeleteCommentModal();
    }
  };

  return (
    <Dialog
      onClose={props.closeDeleteCommentModal}
      open={props.open}
      fullWidth
      sx={{ zIndex: 500 }}
    >
      <DialogTitle fontWeight={600}>Delete Comment</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack spacing={0.5} textAlign="center">
            <Typography variant="subtitle2">
              Are you sure you want to delete?
            </Typography>
            <Typography variant="h6">{props.comment.message}</Typography>
          </Stack>

          <DialogActions sx={{ m: 0, pb: 0 }}>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                onClick={handleDeleteComment}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
              <Button onClick={props.closeDeleteCommentModal} color="button">
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

DeleteCommentModal.propTypes = {
  open: PropTypes.bool,
  closeDeletePostModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  open: state.modal.deleteComment.open,
  comment: state.modal.deleteComment.comment,
});

const mapActionsToProps = {
  closeDeleteCommentModal,
  deleteComment,
};

export default connect(mapStateToProps, mapActionsToProps)(DeleteCommentModal);
