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
  Stack,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { closeDeletePostModal } from "../../redux/ducks/modalDuck";
import { deletePost } from "../../redux/ducks/postDuck";
import PropTypes from "prop-types";

const DeletePostModal = (props) => {
  const handleDeletePost = async () => {
    const successful = await props.deletePost(props.post._id);
    if (successful === true) {
      props.closeDeletePostModal();
      props.sideEffect?.();
    }
  };

  return (
    <Dialog
      onClose={props.closeDeletePostModal}
      open={props.open}
      sx={{ zIndex: 500 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Delete Post</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack spacing={0.5} textAlign="center" alignContent="center">
            <Typography variant="subtitle2">
              Are you sure you want to delete?
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {props.post.title}
            </Typography>
          </Stack>

          <DialogActions>
            <Button
              onClick={handleDeletePost}
              variant="contained"
              color="error"
            >
              Delete Post
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

DeletePostModal.propTypes = {
  open: PropTypes.bool,
  closeDeletePostModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  open: state.modal.deletePost.open,
  post: state.modal.deletePost.post,
});

const mapActionsToProps = {
  closeDeletePostModal,
  deletePost,
};

export default connect(mapStateToProps, mapActionsToProps)(DeletePostModal);
