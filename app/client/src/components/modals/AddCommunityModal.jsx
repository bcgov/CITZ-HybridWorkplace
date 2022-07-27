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
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @module
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createCommunity } from "../../redux/ducks/communityDuck";
import {
  TextField,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Stack,
  InputLabel,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { closeAddCommunityModal } from "../../redux/ducks/modalDuck";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createError } from "../../redux/ducks/alertDuck";
import MarkDownEditor from "../MarkDownEditor";
import InputRuleList from "../InputRuleList";

const AddCommunityModal = (props) => {
  const navigate = useNavigate();

  const minTitleLength = 3;
  const maxTitleLength = 200;
  const maxDescriptionLength = 300;
  const maxResourcesLength = 500;

  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resources, setResources] = useState("");
  const [createCommunityLoading, setCreateCommunityLoading] = useState(false);

  const [rules, setRules] = useState([]);

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [tagDesc, setTagDesc] = useState("");

  const registerCommunity = async (event) => {
    event.preventDefault();
    setCreateCommunityLoading(true);

    const community = {
      title,
      description,
      resources,
      rules,
      tags,
    };

    const successful = await props.createCommunity(community);

    setCreateCommunityLoading(false);
    if (successful === true) {
      props.closeAddCommunityModal();
      navigate("/");
    }
  };

  const handleCancelClick = () => {
    setPage(1);
    setTitle("");
    setDescription("");
    setRules([]);
    setTags([]);
    setResources("");
    props.closeAddCommunityModal();
  };

  const addTag = () => {
    if (tags.length < 7) {
      let updatedTags = tags;
      updatedTags.push({ tag, description: tagDesc, count: 0 });
      setTags(updatedTags);
      setTag("");
      setTagDesc("");
    } else {
      props.createError("Community can't have more than 7 tags.");
    }
  };

  const page1 = () => {
    return (
      <>
        <Box sx={{ height: "60vh" }}>
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
        <DialogActions sx={{ alignSelf: "end" }}>
          <Stack spacing={1} direction="row-reverse" justifyContent="end">
            <Button
              onClick={() => setPage(2)}
              color="button"
              disabled={
                title.length < minTitleLength ||
                title.length > maxTitleLength ||
                description.length > maxDescriptionLength
              }
            >
              Next
            </Button>
            <Button onClick={handleCancelClick} color="button">
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </>
    );
  };

  const page2 = () => {
    return (
      <>
        <Box sx={{ height: "60vh" }}>
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
        <DialogActions>
          <Stack spacing={1} direction="row-reverse" justifyContent="end">
            <Button onClick={() => setPage(3)} color="button">
              Next
            </Button>
            <Button onClick={() => setPage(1)} color="button">
              Prev
            </Button>
          </Stack>
        </DialogActions>
      </>
    );
  };

  const page3 = () => {
    return (
      <>
        <Box sx={{ height: "60vh" }}>
          <Stack sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ my: 1 }}>
              Community Tags
            </Typography>
            <Typography sx={{ mb: 1 }}>
              Meaningful community engagement metadata which is used to filter
              and serve relevent content. (Optional)
            </Typography>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Add tags for community members to tag posts with.
              </AccordionSummary>
              <AccordionDetails>
                <List
                  sx={{
                    overflow: "auto",
                    maxHeight: 300,
                    border: "solid",
                    borderRadius: "5px",
                    borderColor: "#D0D0D0",
                  }}
                >
                  {tags.map((obj) => (
                    <ListItem key={tags.indexOf(obj)} sx={{ py: 0 }}>
                      <ListItemText
                        primary={
                          <>
                            <Typography>
                              {tags.indexOf(obj) + 1}. {obj.tag}
                            </Typography>
                            <Typography sx={{ pl: 2, color: "#999999" }}>
                              {obj.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                  {tags.length > 0 && (
                    <Divider variant="middle" sx={{ pt: 3 }} />
                  )}
                  <ListItem key={"input-tag"}>
                    <Stack spacing={1} width="1">
                      <Typography>Add a new tag:</Typography>
                      <TextField
                        id="create-community-tag"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        type="text"
                        multiline
                        maxRows={3}
                        placeholder="New tag"
                        error={
                          tag === "" || (tag.length >= 3 && tag.length <= 16)
                            ? false
                            : true
                        }
                        helperText="Tag must be 3-16 characters in length."
                        sx={{ width: 0.95 }}
                      />
                      <TextField
                        id="create-community-tag-desc"
                        value={tagDesc}
                        onChange={(e) => setTagDesc(e.target.value)}
                        type="text"
                        multiline
                        maxRows={3}
                        placeholder="Add a description"
                        error={
                          tagDesc === "" || tagDesc.length <= 200 ? false : true
                        }
                        helperText="Tag description must be less than 200 characters in length."
                        sx={{ width: 0.95 }}
                      />
                      <Button
                        onClick={addTag}
                        sx={{ width: 0.1 }}
                        color="button"
                      >
                        <Typography>Add</Typography>
                        <AddIcon />
                      </Button>
                    </Stack>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Box>
        <DialogActions>
          <Stack spacing={1} direction="row-reverse" justifyContent="end">
            <Button onClick={() => setPage(4)} color="button">
              Next
            </Button>
            <Button onClick={() => setPage(2)} color="button">
              Prev
            </Button>
          </Stack>
        </DialogActions>
      </>
    );
  };

  const page4 = () => {
    return (
      <>
        <Box sx={{ height: "60vh" }}>
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
        <DialogActions>
          <Stack spacing={1} direction="row-reverse" justifyContent="end">
            <LoadingButton
              variant="contained"
              loading={createCommunityLoading}
              disabled={
                title.length < minTitleLength ||
                title.length > maxTitleLength ||
                description.length > maxDescriptionLength
              }
              onClick={registerCommunity}
            >
              Create
            </LoadingButton>
            <Button onClick={() => setPage(3)} color="button">
              Prev
            </Button>
          </Stack>
        </DialogActions>
      </>
    );
  };

  const selectPage = () => {
    switch (page) {
      case 2:
        return page2();
      case 3:
        return page3();
      case 4:
        return page4();
      default:
        return page1();
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeAddCommunityModal}
      sx={{ zIndex: 500, mb: 5 }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5em" }}>
        Create Community
      </DialogTitle>
      <DialogContent>{selectPage()}</DialogContent>
    </Dialog>
  );
};

AddCommunityModal.propTypes = {
  createCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  open: state.modal.addCommunity.open,
});

export default connect(mapStateToProps, {
  createCommunity,
  closeAddCommunityModal,
  createError,
})(AddCommunityModal);
