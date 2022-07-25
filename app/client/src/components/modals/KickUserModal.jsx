import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  closeKickUserModal,
  closeCommunityMembersModal,
} from "../../redux/ducks/modalDuck";
import { kickCommunityMember } from "../../redux/ducks/communityDuck";
import WarningIcon from "@mui/icons-material/Warning";

export const KickUserModal = (props) => {
  useEffect(() => {
    setUsernameInput(props.username);
  }, [props.username]);

  const [usernameInput, setUsernameInput] = useState(props.username ?? "");
  const [kickPeriod, setKickPeriod] = useState("");

  const onUsernameInputChange = (e) => {
    setUsernameInput(e.target.value);
  };

  const handlePeriodSelect = (e) => setKickPeriod(e.target.value);

  const handleCancelClick = () => {
    props.closeCommunityMembersModal();
    props.closePromoteUserModal();
  };

  const handleKickClick = async () => {
    const user = {
      community: props.communityTitle,
      username: usernameInput,
    };

    const time = kickPeriod;

    const successful = await props.kickCommunityMember(user, time);
    if (successful) {
      props.closeCommunityMembersModal();
      props.closeKickUserModal();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeKickUserModal}
      fullWidth
      sx={{ zIndex: 500 }}
    >
      <DialogTitle fontWeight={600}>Kick User</DialogTitle>
      {/* TODO: Use the autocomplete component to display a list of users */}
      <DialogContent>
        <Stack alignItems="center" spacing={2}>
          <TextField
            placeholder="IDIR/Username"
            value={usernameInput}
            onChange={onUsernameInputChange}
            fullWidth
            helperText="Enter the IDIR/Username of the member you wish to promote to moderator."
          />
          <InputLabel id="kick-period-select-label">Kick Period</InputLabel>
          <Select
            labelId="kick-period-select-label"
            id="kick-period-select"
            value={kickPeriod}
            label="Kick Period"
            onChange={handlePeriodSelect}
          >
            <MenuItem value="test">Test</MenuItem>
            <MenuItem value="hour">Hour</MenuItem>
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="forever">Forever</MenuItem>
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="button" variant="text" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error.main"
          onClick={handleKickClick}
        >
          Kick
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  open: state.modal.editUserKick.open,
  username: state.modal.editUserKick.user,
  communityTitle:
    state.communities.communities[state.communities.currentCommunityIndex]
      ?.title ?? "",
});

const mapDispatchToProps = {
  closeKickUserModal,
  kickCommunityMember,
  closeCommunityMembersModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(KickUserModal);
