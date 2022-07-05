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
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { closeAddCommunityModal } from "../../redux/ducks/modalDuck";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createError } from "../../redux/ducks/alertDuck";

const AddCommunityModal = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createCommunityLoading, setCreateCommunityLoading] = useState(false);

  const [rules, setRules] = useState([]);
  const [rule, setRule] = useState("");
  const [ruleDesc, setRuleDesc] = useState("");

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [tagDesc, setTagDesc] = useState("");

  const registerCommunity = async (event) => {
    event.preventDefault();
    setCreateCommunityLoading(true);

    const community = {
      title: title,
      description: description,
      rules: rules,
      tags: tags,
    };

    const successful = await props.createCommunity(community);

    setCreateCommunityLoading(false);
    if (successful === true) {
      props.closeAddCommunityModal();
      navigate("/");
    }
  };

  const addRule = () => {
    let updatedRules = rules;
    updatedRules.push({ rule, description: ruleDesc });
    setRules(updatedRules);
    setRule("");
    setRuleDesc("");
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

  return (
    <Dialog
      open={props.open}
      onClose={props.closeAddCommunityModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Create Community
        </Typography>
      </DialogTitle>
      <DialogContent data-color-mode="light">
        <Stack spacing={1}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="create-community-title">Title</InputLabel>
            <TextField
              id="create-community-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              error={
                title === "" || (title.length >= 3 && title.length <= 25)
                  ? false
                  : true
              }
              helperText="Title must be 3-25 characters in length."
              required
            />
          </Stack>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="create-community-description">
              Description
            </InputLabel>
            <TextField
              id="create-community-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              multiline
              maxRows={3}
              placeholder="Description"
              error={
                description === "" ||
                (description.length >= 3 && description.length <= 300)
                  ? false
                  : true
              }
              helperText="Description is required."
              required
            />
          </Stack>
          <Stack sx={{ mb: 2 }}>
            <InputLabel htmlFor="create-community-rules">
              Community Rules
            </InputLabel>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Set rules for community members to follow.
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
                  {rules.map((obj) => (
                    <ListItem key={rules.indexOf(obj)} sx={{ py: 0 }}>
                      <ListItemText
                        primary={
                          <>
                            <Typography>
                              {rules.indexOf(obj) + 1}. {obj.rule}
                            </Typography>
                            <Typography sx={{ pl: 2, color: "#999999" }}>
                              {obj.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                  {rules.length > 0 && (
                    <Divider variant="middle" sx={{ pt: 3 }} />
                  )}
                  <ListItem key={"input-rules"}>
                    <Stack spacing={1} width="1">
                      <Typography>Add a new rule:</Typography>
                      <TextField
                        id="create-community-rule"
                        value={rule}
                        onChange={(e) => setRule(e.target.value)}
                        type="text"
                        multiline
                        maxRows={3}
                        placeholder="New rule"
                        error={
                          rule === "" || (rule.length >= 3 && rule.length <= 50)
                            ? false
                            : true
                        }
                        helperText="Rule must be 3-50 characters in length."
                        sx={{ width: 0.95 }}
                      />
                      <TextField
                        id="create-community-rule-desc"
                        value={ruleDesc}
                        onChange={(e) => setRuleDesc(e.target.value)}
                        type="text"
                        multiline
                        maxRows={3}
                        placeholder="Add a description"
                        error={
                          ruleDesc === "" || ruleDesc.length <= 200
                            ? false
                            : true
                        }
                        helperText="Rule description must be less than 200 characters in length."
                        sx={{ width: 0.95 }}
                      />
                      <Button onClick={addRule} sx={{ width: 0.1 }}>
                        <Typography>Add</Typography>
                        <AddIcon />
                      </Button>
                    </Stack>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Stack>

          <Stack sx={{ mb: 2 }}>
            <InputLabel htmlFor="create-community-rules">
              Community Tags
            </InputLabel>

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
                      <Button onClick={addTag} sx={{ width: 0.1 }}>
                        <Typography>Add</Typography>
                        <AddIcon />
                      </Button>
                    </Stack>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Stack>

          <DialogActions>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <LoadingButton
                variant="contained"
                loading={createCommunityLoading}
                disabled={
                  title.length < 3 ||
                  title.length > 25 ||
                  description.length > 300 ||
                  rules.length === 0
                }
                onClick={registerCommunity}
              >
                Submit
              </LoadingButton>
              <Button
                variant="contained"
                onClick={props.closeAddCommunityModal}
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
