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
  InputLabel,
  Stack,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { closeEditCommunityModal } from "../../redux/ducks/modalDuck";
import { createError } from "../../redux/ducks/alertDuck";
import { editCommunity } from "../../redux/ducks/communityDuck";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import MarkDownEditor from "../MarkDownEditor";
import InputRuleList from "../InputRuleList";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const EditCommunityModal = (props) => {
  const [title, setTitle] = useState(props.community.title ?? "");
  const [description, setDescription] = useState(
    props.community.description ?? ""
  );
  const [rules, setRules] = useState(props.community.rules ?? []);
  const [resources, setResources] = useState(props.community.resources ?? "");

  const minTitleLength = 3;
  const maxTitleLength = 200;
  const maxDescriptionLength = 300;
  const maxResourcesLength = 500;

  const [page, setPage] = useState(1);

  useEffect(() => {
    setTitle(props.community.title ?? "");
  }, [props.community.title]);

  useEffect(() => {
    setDescription(props.community.description ?? "");
  }, [props.community.description]);

  useEffect(() => {
    setRules(props.community.rules ?? "");
  }, [props.community.rules]);

  useEffect(() => {
    setResources(props.community.resources ?? "");
  }, [props.community.resources]);

  const makeChangesObject = (
    commTitle,
    commDescription,
    commRules,
    commResources
  ) => {
    const newComm = {};
    if (commTitle !== props.community.title) {
      newComm.title = commTitle;
    }
    if (commDescription !== props.community.description) {
      newComm.description = commDescription;
    }
    if (commRules !== props.community.rules) {
      newComm.rules = commRules;
    }
    if (commResources !== props.community.resources) {
      newComm.resources = commResources;
    }
    return Object.keys(newComm).length === 0
      ? null
      : { ...newComm, oldTitle: props.community.title };
  };

  const onSubmit = async () => {
    const changes = makeChangesObject(title, description, rules, resources);
    if (!changes) {
      props.createError("Modifying a community requires at least one change.");
      return;
    }
    const successful = await props.editCommunity(
      props.community.title,
      changes
    );
    if (successful) {
      // To be uncommented when backend supports community title change
      //navigate(`/community/${newComm.title || props.community.title}`);
      document.location.reload();
    }
  };

  const page1 = () => {
    return (
      <>
        <Box sx={{ height: "65vh" }}>
          <Stack spacing={0.5} sx={{ mb: 4 }}>
            <InputLabel htmlFor="create-community-title">Title</InputLabel>
            <TextField
              id="create-community-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              error={
                (title.length > 0 && title.length < minTitleLength) ||
                title.length > maxTitleLength
              }
              helperText={`Title must be ${minTitleLength}-${maxTitleLength} characters in length.`}
              required
            />
          </Stack>
          <MarkDownEditor
            label="Description"
            error={description.length > maxDescriptionLength}
            id="description-input"
            value={description}
            onChange={setDescription}
          />
        </Box>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
        >
          <Typography variant="body1">Page {page}/3</Typography>
          <Stack spacing={1} direction="row-reverse" justifyContent="end">
            <Button
              onClick={() => setPage(2)}
              disabled={
                title.length < minTitleLength ||
                title.length > maxTitleLength ||
                description.length > maxDescriptionLength
              }
              variant="contained"
            >
              Next
            </Button>
            <Button onClick={props.closeEditCommunityModal} color="button">
              Cancel
            </Button>
          </Stack>
        </Stack>
      </>
    );
  };

  const page2 = () => {
    return (
      <>
        <Box sx={{ height: "65vh" }}>
          <Stack sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ my: 1 }}>
              Community Rules
            </Typography>
            <Typography sx={{ mb: 1 }}>
              The standards by which moderators enforce community engagement.
              (Optional)
            </Typography>
            <InputRuleList rules={rules} setRules={setRules} />
          </Stack>
        </Box>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
        >
          <Typography variant="body1">Page {page}/3</Typography>
          <Stack spacing={1} direction="row-reverse" justifyContent="end">
            <Button onClick={() => setPage(3)} variant="contained">
              Next
            </Button>
            <Button onClick={() => setPage(1)} color="button">
              Prev
            </Button>
          </Stack>
        </Stack>
      </>
    );
  };

  const page3 = () => {
    return (
      <>
        <Box sx={{ height: "65vh" }}>
          <Typography variant="h6" sx={{ my: 1 }}>
            Community Resources
          </Typography>
          <Typography sx={{ my: 1 }}>
            Include hyperlinks that can be utilized by community members.
            (Optional)
          </Typography>
          <MarkDownEditor
            error={resources.length > maxResourcesLength}
            id="resources-input"
            value={resources}
            onChange={setResources}
          />
        </Box>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
        >
          <Typography variant="body1">Page {page}/3</Typography>
          <Stack spacing={1} direction="row-reverse" justifyContent="end">
            <Button
              variant="contained"
              disabled={
                title.length < minTitleLength ||
                title.length > maxTitleLength ||
                description.length > maxDescriptionLength
              }
              onClick={onSubmit}
            >
              Edit
            </Button>
            <Button onClick={() => setPage(2)} color="button">
              Prev
            </Button>
          </Stack>
        </Stack>
      </>
    );
  };

  const selectPage = () => {
    switch (page) {
      case 2:
        return page2();
      case 3:
        return page3();
      default:
        return page1();
    }
  };

  return (
    <Dialog
      onClose={props.closeEditCommunityModal}
      open={props.open}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 500, mb: 5 }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5em" }}>
        Edit Community
      </DialogTitle>
      <DialogContent>{selectPage()}</DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  open: state.modal.editCommunity.open,
  community: state.modal.editCommunity.community,
});

const mapActionsToProps = {
  closeEditCommunityModal,
  editCommunity,
  createError,
};

export default connect(mapStateToProps, mapActionsToProps)(EditCommunityModal);
