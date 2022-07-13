import {
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Rule from "./RuleInput";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
const CommunityRuleInput = (props) => {
  const [rules, setRules] = useState(props.rules);

  useEffect(() => {
    setRules(props.rules);
  }, [props.rules]);

  useEffect(() => {
    props.setRules(rules);
  }, [rules]);

  const setRule = (ruleIndex) => (newRule) => {
    if (newRule === null) {
      setRules((prev) => {
        const newRulesList = [...prev];
        newRulesList.splice(ruleIndex, 1);
        return newRulesList;
      });
    } else {
      setRules((prev) => {
        const newRulesList = [...prev];
        newRulesList.splice(ruleIndex, 1, newRule);
        return newRulesList;
      });
    }
  };

  const createNewRule = () => {
    props.setRules((prev) => [...prev, { rule: "", description: "" }]);
  };

  return (
    <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
      <Grid container>
        {props.rules &&
          rules.map((rule, index) => (
            <Grid item xs={11} key={rule + index}>
              <Rule
                rule={rule.rule}
                description={rule.description}
                index={index}
                setRule={setRule(index)}
              />
            </Grid>
          ))}
      </Grid>

      <IconButton onClick={createNewRule}>
        <AddCircleTwoToneIcon color="success" />
      </IconButton>
    </Box>
  );
};

export default CommunityRuleInput;
