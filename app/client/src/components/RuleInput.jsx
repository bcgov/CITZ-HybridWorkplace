import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { useEffect } from "react";

const RuleInput = (props) => {
  const [showInput, setShowInput] = useState(props.editRuleOpen ?? true);
  const [rule, setRule] = useState(props.rule);
  const [description, setDescription] = useState(props.description);

  useEffect(() => {
    setRule(props.rule);
  }, [props.rule]);

  useEffect(() => {
    setDescription(props.description);
  }, [props.description]);

  const editRuleObject = () => {
    props.setRule({ rule, description });
  };

  const deleteRule = () => {
    props.setRule(null);
  };

  const onRuleChange = (event) => {
    setRule(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const onCancel = () => {
    if (
      rule.length < 3 ||
      rule.length > 50 ||
      !props.rule.rule ||
      props.rule.rule === ""
    ) {
      deleteRule();
    } else {
      setShowInput(false);
      setRule(props.rule);
      setDescription(props.description);
    }
  };

  const onSaveRule = () => {
    if (rule.length < 3 || rule.length > 50) {
      deleteRule();
    } else {
      setShowInput(false);
      editRuleObject();
    }
  };

  return (
    <Card sx={{ padding: 2, mt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1">{`Rule ${props.index + 1}.`}</Typography>
        <IconButton onClick={deleteRule}>
          <ClearTwoToneIcon color="error" />
        </IconButton>
      </Stack>

      <CardContent>
        {!showInput ? (
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={11.4}>
              <Stack spacing={1}>
                <div>
                  <Typography variant="body1">Rule:</Typography>
                  {rule ? (
                    <Typography variant="body1">{rule}</Typography>
                  ) : (
                    <Typography variant="overline" color="error">
                      empty
                    </Typography>
                  )}
                </div>
                <div>
                  <Typography variant="body1">Description:</Typography>
                  {description ? (
                    <Typography variant="body1">{description}</Typography>
                  ) : (
                    <Typography variant="overline" color="error">
                      empty
                    </Typography>
                  )}
                </div>
              </Stack>
            </Grid>
            <Grid item xs={0.6}>
              <IconButton onClick={() => setShowInput(true)} color="button">
                <EditTwoToneIcon color="button" />
              </IconButton>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>Rule</InputLabel>
                <TextField
                  value={rule}
                  size="small"
                  name="rule"
                  onChange={onRuleChange}
                  helperText="Rule must be 3-50 characters in length."
                  error={!rule || rule.length < 3 || rule.length > 50}
                ></TextField>
                <InputLabel>Description</InputLabel>
                <TextField
                  value={description}
                  size="small"
                  multiline
                  minRows={2}
                  name="description"
                  onChange={onDescriptionChange}
                  helperText="Rule description must be less than 200 characters in length."
                  error={description?.length >= 200}
                ></TextField>
              </Stack>
            </Grid>

            <Grid item>
              <Button variant="text" color="button" onClick={onCancel}>
                Discard Changes
              </Button>
              <Button
                variant="contained"
                color="button"
                disabled={
                  (rule.length > 0 && rule.length < 3) ||
                  rule.length > 50 ||
                  description > 200
                }
                sx={{ color: "white" }}
                onClick={onSaveRule}
              >
                Save Rule
              </Button>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default RuleInput;
