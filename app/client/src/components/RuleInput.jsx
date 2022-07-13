import {
  Button,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { useEffect } from "react";

const Rule = (props) => {
  const [showInput, setShowInput] = useState(false);
  const [rule, setRule] = useState(props.rule);
  const [description, setDescription] = useState(props.description);

  useEffect(() => {
    setRule(props.rule);
  }, [props.rule]);

  useEffect(() => {
    setDescription(props.description);
  }, [props.description]);

  useEffect(() => {
    props.setRule({ rule, description });
  }, [rule, description]);

  const onRuleChange = (event) => {
    setRule(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const deleteRule = () => {
    props.setRule(null);
  };

  return !showInput ? (
    <Grid container justifyContent="space-between">
      <Grid item>
        <Typography variant="h6">{rule}</Typography>
        <Typography variant="body1">{description}</Typography>
      </Grid>
      <Grid item>
        <Button onClick={() => setShowInput(true)}>
          <EditTwoToneIcon color="primary" />
          Edit
        </Button>
      </Grid>
    </Grid>
  ) : (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1">Rule {props.index + 1}.</Typography>
      </Grid>
      <Grid item xs={10}>
        <Stack spacing={1}>
          <InputLabel>Rule</InputLabel>
          <TextField
            value={rule}
            size="small"
            name="rule"
            onChange={onRuleChange}
          ></TextField>
          <InputLabel>Description</InputLabel>
          <TextField
            value={description}
            size="small"
            multiline
            minRows={2}
            name="description"
            onChange={onDescriptionChange}
          ></TextField>
        </Stack>
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={deleteRule}>
          <RemoveCircleTwoToneIcon color="error" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Rule;
