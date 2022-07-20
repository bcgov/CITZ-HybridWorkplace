import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  closePromoteUserModal,
  closeCommunityMembersModal,
} from "../../redux/ducks/modalDuck";
import { promoteUser } from "../../redux/ducks/communityDuck";
import WarningIcon from "@mui/icons-material/Warning";

export const PromoteUserModal = (props) => {
  useEffect(() => {
    setUsernameInput(props.username);
  }, [props.username]);

  const [usernameInput, setUsernameInput] = useState(props.username ?? "");

  const [setModeratorsPerm, setSetModeratorsPerm] = useState(false);
  const [setPermissionsPerm, setSetPermissionsPerm] = useState(false);
  const [removeCommunityPerm, setRemoveCommunityPerm] = useState(false);

  const onSetModeratorsPermChange = (event) => {
    setSetModeratorsPerm(event.target.checked);
  };

  const onSetPermissionsPermChange = (event) => {
    setSetPermissionsPerm(event.target.checked);
  };

  const onRemoveCommunityPermChange = (event) => {
    setRemoveCommunityPerm(event.target.checked);
  };

  const formatPermissionsArray = () => {
    const perms = [];
    if (setModeratorsPerm) perms.push("set_moderators");
    if (setPermissionsPerm) perms.push("set_permissions");
    if (removeCommunityPerm) perms.push("remove_community");
    return perms;
  };
  const onUsernameInputChange = (e) => {
    setUsernameInput(e.target.value);
  };
  const handleCancelClick = () => {
    props.closeCommunityMembersModal();
    props.closePromoteUserModal();
  };
  const handlePromoteClick = async () => {
    const user = {
      community: props.communityTitle,
      username: usernameInput,
      permissions: formatPermissionsArray(),
    };

    const successful = await props.promoteUser(user);
    if (successful) {
      props.closeCommunityMembersModal();
      props.closePromoteUserModal();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closePromoteUserModal}
      fullWidth
      sx={{ zIndex: 500 }}
    >
      <DialogTitle fontWeight={600}>Promote User To Moderator</DialogTitle>
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
          <Stack spacing={1}>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: "center", display: "flex" }}
            >
              <Checkbox
                checked={setModeratorsPerm}
                onChange={onSetModeratorsPermChange}
              />
              <Typography>
                Moderator can add and remove other moderators.
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: "center", display: "flex" }}
            >
              <Checkbox
                checked={setPermissionsPerm}
                onChange={onSetPermissionsPermChange}
              />
              <Typography>
                Moderator can set other moderators permissions.
              </Typography>
            </Stack>
            <Stack spacing={0.5} direction="row">
              <WarningIcon fontSize="small" sx={{ color: "#FD1B1B" }} />
              <Typography sx={{ color: "#FD1B1B" }}>
                WARNING: This permission should only be given to the most
                trusted of moderators. They will be able to set any permission
                on other moderators, including themselves.
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: "center", display: "flex" }}
            >
              <Checkbox
                checked={removeCommunityPerm}
                onChange={onRemoveCommunityPermChange}
              />
              <Typography>Moderator can remove the community.</Typography>
            </Stack>
            <Stack spacing={0.5} direction="row">
              <WarningIcon fontSize="small" sx={{ color: "#FD1B1B" }} />
              <Typography sx={{ color: "#FD1B1B" }}>
                WARNING: This permission should only be given to the most
                trusted of moderators. They will be able to remove the entire
                community. Admins can undo these actions, but it's best to
                prevent this situation in the first place.
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="button" variant="text" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handlePromoteClick}>
          Promote
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  open: state.modal.promoteUser.open,
  username: state.modal.promoteUser.username,
  communityTitle:
    state.communities.communities[state.communities.currentCommunityIndex]
      ?.title ?? "",
});

const mapDispatchToProps = {
  closePromoteUserModal,
  promoteUser,
  closeCommunityMembersModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoteUserModal);
