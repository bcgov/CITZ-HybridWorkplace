import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { closeDemoteUserModal } from "../../redux/ducks/modalDuck";
import { demoteUser } from "../../redux/ducks/communityDuck";

export const DemoteUserModal = (props) => {
  const handleDemoteClick = async () => {
    const successful = await props.demoteUser(
      props.username,
      props.communityTitle
    );
    if (successful) {
      props.closeDemoteUserModal();
    }
  };
  const handleCancelClick = () => {
    props.closeDemoteUserModal();
  };
  return (
    <Dialog open={props.open} onClose={props.closeDemoteUserModal} fullWidth>
      <DialogTitle fontWeight={600}>Demote User</DialogTitle>
      <DialogContent>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h5">Are you sure you want to demote</Typography>
          <Typography variant="h5">{props.username}</Typography>
          <Button variant="contained" color="error" onClick={handleDemoteClick}>
            Demote
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="button" onClick={handleCancelClick}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  open: state.modal.demoteUser.open,
  username: state.modal.demoteUser.username,
  communityTitle:
    state.communities.communities[state.communities.currentCommunityIndex]
      ?.title,
});

const mapDispatchToProps = { closeDemoteUserModal, demoteUser };

export default connect(mapStateToProps, mapDispatchToProps)(DemoteUserModal);
