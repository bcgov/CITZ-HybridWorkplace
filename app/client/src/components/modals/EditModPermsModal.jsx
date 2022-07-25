//
// Copyright © 2022 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Application entry point
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Checkbox,
  DialogActions,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

import { closeEditModeratorPermissionsModal } from "../../redux/ducks/modalDuck";
import { editCommunityModeratorPermissions } from "../../redux/ducks/communityDuck";

const EditModPermsModal = (props) => {
  const [moderatorUsername, setModeratorUsername] = useState("");
  const [moderatorName, setModeratorName] = useState("");

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

  useEffect(() => {
    setModeratorUsername(props.moderator?.username ?? "");
    setModeratorName(props.moderator?.name ?? "");
    if (props.moderator?.permissions?.includes("set_moderators"))
      setSetModeratorsPerm(true);
    if (props.moderator?.permissions?.includes("set_permissions"))
      setSetPermissionsPerm(true);
    if (props.moderator?.permissions?.includes("remove_community"))
      setRemoveCommunityPerm(true);
  }, [props.moderator]);

  const formatPermissionsArray = () => {
    const perms = [];
    if (setModeratorsPerm) perms.push("set_moderators");
    if (setPermissionsPerm) perms.push("set_permissions");
    if (removeCommunityPerm) perms.push("remove_community");
    return perms;
  };

  const registerPermissions = async () => {
    const moderator = {
      community: props.community,
      username: moderatorUsername,
      permissions: formatPermissionsArray(),
    };

    const successful = await props.editCommunityModeratorPermissions(
      moderator ?? {}
    );
    if (successful === true) {
      setModeratorUsername("");
      setModeratorName("");
      setSetModeratorsPerm(false);
      setSetPermissionsPerm(false);
      setRemoveCommunityPerm(false);
      props.closeEditModeratorPermissionsModal();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeEditModeratorPermissionsModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>Edit Moderator Permissions</DialogTitle>
      <DialogContent>
        <Stack spacing={0.5}>
          <Typography>Username: {moderatorUsername}</Typography>
          <Typography>Full Name: {moderatorName}</Typography>
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
          <DialogActions
            sx={{
              m: 0,
              pb: 0,
            }}
          >
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button variant="contained" onClick={registerPermissions}>
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={props.closeEditModeratorPermissionsModal}
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

const mapStateToProps = (state) => ({
  auth: state.auth,
  moderator: state.modal.editModPermissions.moderator,
  open: state.modal.editModPermissions.open,
});

export default connect(mapStateToProps, {
  editCommunityModeratorPermissions,
  closeEditModeratorPermissionsModal,
})(EditModPermsModal);
