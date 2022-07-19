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
  Grid,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { closeDeleteCommunityModal } from "../../redux/ducks/modalDuck";
import { deleteCommunity } from "../../redux/ducks/communityDuck";
import PropTypes from "prop-types";

const DeleteCommunityModal = (props) => {
  const handleDeleteCommunity = async () => {
    const successful = await props.deleteCommunity(props.community.title);
    if (successful === true) {
      props.closeDeleteCommunityModal();
    }
  };

  return (
    <Dialog
      onClose={props.closeDeleteCommunityModal}
      open={props.open}
      fullWidth
      sx={{ zIndex: 500 }}
    >
      <DialogTitle fontWeight={600}>Delete Community</DialogTitle>
      <DialogContent>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Grid item xs={12}>
            <Typography variant="h5">Deleting Community:</Typography>
            <br />
            <Typography variant="h4" align="center">
              {props.community.title}
            </Typography>
            <br />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack spacing={1} direction="row-reverse" justifyContent="end">
          <Button
            onClick={handleDeleteCommunity}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
          <Button onClick={props.closeDeleteCommunityModal} color="button">Cancel</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

DeleteCommunityModal.propTypes = {
  open: PropTypes.bool,
  closeDeleteCommunityModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  open: state.modal.deleteCommunity.open,
  community: state.modal.deleteCommunity.community,
});

const mapActionsToProps = {
  closeDeleteCommunityModal,
  deleteCommunity,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(DeleteCommunityModal);
