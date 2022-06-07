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
    }
  };

  return (
    <Dialog
      onClose={props.closeDeletePostModal}
      open={props.open}
      fullWidth="md"
    >
      <DialogTitle>Delete Post</DialogTitle>
      <DialogContent>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Grid item xs={12}>
            <Typography variant="h4">
              Deleting Post: {props.post.title}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeletePost} variant="contained" color="error">
          Delete Post
        </Button>
      </DialogActions>
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
