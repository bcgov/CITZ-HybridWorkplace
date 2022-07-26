import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  closeKickUserModal,
  closeCommunityMembersModal,
} from "../../redux/ducks/modalDuck";
import { kickCommunityMember } from "../../redux/ducks/communityDuck";

export const KickUserModal = (props) => {
  console.log(props);
  useEffect(() => {
    setUsernameInput(props.user.username);
  }, [props.user]);

  const [usernameInput, setUsernameInput] = useState(props.user.username ?? "");
  const [kickPeriod, setKickPeriod] = useState("hour");

  const onUsernameInputChange = (e) => {
    setUsernameInput(e.target.value);
  };

  const handlePeriodSelect = (e) => setKickPeriod(e.target.value);

  const handleCancelClick = () => {
    props.closeCommunityMembersModal();
    props.closeKickUserModal();
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
      <DialogContent>
        <Stack alignItems="start" spacing={1}>
          <Stack width={1} spacing={1}>
            <InputLabel id="idir-username-textfield-label">
              IDIR\Username
            </InputLabel>
            <TextField
              labelId="idir-username-textfield-label"
              placeholder="IDIR\Username"
              value={usernameInput}
              onChange={onUsernameInputChange}
              fullWidth
              helperText="Enter the IDIR\Username of the member you wish to kick/suspend from the community."
            />
          </Stack>
          <Stack width={1} spacing={1}>
            <InputLabel id="kick-period-select-label">Kick Period</InputLabel>
            <Select
              labelId="kick-period-select-label"
              id="kick-period-select"
              value={kickPeriod}
              fullWidth
              onChange={handlePeriodSelect}
            >
              <MenuItem value="test">Test</MenuItem>
              <MenuItem value="hour">Hour</MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="forever">Forever</MenuItem>
            </Select>
          </Stack>
        </Stack>
        <DialogActions spacing={1} sx={{ mt: 1, pr: 0 }}>
          <Button color="button" variant="text" onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleKickClick}>
            Kick
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  open: state.modal.editUserKick.open,
  user: state.modal.editUserKick.user,
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
