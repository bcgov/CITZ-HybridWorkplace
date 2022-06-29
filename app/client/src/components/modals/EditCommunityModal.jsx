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
  TextField,
<<<<<<< HEAD
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  InputLabel,
=======
  Typography,
>>>>>>> 29ce40e (HWP-421: Overhaul Profile Page & Associated Components)
} from "@mui/material";
import { closeEditCommunityModal } from "../../redux/ducks/modalDuck";
import { createError } from "../../redux/ducks/alertDuck";
import { editCommunity } from "../../redux/ducks/communityDuck";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const EditCommunityModal = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(props.community.title);
  const [description, setDescription] = useState(props.community.description);

  const [rules, setRules] = useState(props.community.rules);
  const [rule, setRule] = useState("");
  const [ruleDesc, setRuleDesc] = useState("");

  useEffect(() => {
    setTitle(props.community.title);
  }, [props.community.title]);

  useEffect(() => {
    setDescription(props.community.description);
  }, [props.community.description]);

  useEffect(() => {
    setRules(props.community.rules);
  }, [props.community.rules]);

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const makeChangesObject = (commTitle, commDescription, commRules) => {
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
    return Object.keys(newComm).length === 0
      ? null
      : { ...newComm, oldTitle: props.community.title };
  };

  const onSubmit = async () => {
    const changes = makeChangesObject(title, description, rules);
    if (!changes) {
      props.createError("Modifying a community requires at least one change.");
      return;
    }
    const successful = await props.editCommunity(changes);
    if (successful) {
      navigate(`/community/${changes.title || changes.oldTitle}`);
      document.location.reload();
    }
  };

  const addRule = () => {
    let updatedRules = rules;
    updatedRules.push({ rule, description: ruleDesc });
    setRules(updatedRules);
    setRule("");
    setRuleDesc("");
  };

  return (
    <Dialog
      onClose={props.closeEditCommunityModal}
      open={props.open}
      fullWidth
      sx={{ zIndex: 500 }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Edit Community
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 5 }}>
        <Stack spacing={3}>
          <TextField
            sx={{ mt: 1 }}
            onChange={onTitleChange}
            placeholder="Title"
            value={title}
            label="Title"
            size="small"
            error={
              title &&
              (title === "" || (title.length >= 3 && title.length <= 25))
                ? false
                : true
            }
            helperText="Title must be 3-25 characters in length."
            required
          />
          <TextField
            onChange={onDescriptionChange}
            name="description"
            placeholder="Description"
            multiline
            value={description}
            label="Description"
            size="small"
            minRows={4}
            error={
              description &&
              description.length >= 0 &&
              description.length <= 300
                ? false
                : true
            }
            helperText="Description must be between 1-300 characters in length."
          />
<<<<<<< HEAD
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
                  {rules &&
                    rules.map((obj) => (
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
                  {rules && rules.length > 0 && (
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

          <Button
            variant="contained"
            disabled={
              (title &&
                description &&
                rules &&
                (title.length < 3 ||
                  title.length > 25 ||
                  description.length > 300)) ||
              !rules
            }
            onClick={onSubmit}
          >
            Edit Community
          </Button>
=======
          <TextField
            onChange={onRulesChange}
            name="rules"
            placeholder="Rules"
            multiline
            value={rules}
            label="Rules"
            size="small"
            minRows={4}
            error={false}
            helperText="Rules is required."
            required
          />
          <DialogActions sx={{ m: 0, pb: 0 }}>
            <Stack spacing={1} direction="row-reverse" justifyContent="end">
              <Button
                variant="contained"
                disabled={
                  (title &&
                    description &&
                    rules &&
                    (title.length < 3 ||
                      title.length > 25 ||
                      description.length > 300)) ||
                  !rules
                }
                onClick={onSubmit}
              >
                Edit Community
              </Button>
              <Button
                variant="contained"
                onClick={props.closeEditCommunityModal}
              >
                Cancel
              </Button>
            </Stack>
          </DialogActions>
>>>>>>> 29ce40e (HWP-421: Overhaul Profile Page & Associated Components)
        </Stack>
      </DialogContent>
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
