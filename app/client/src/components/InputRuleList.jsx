import { Button, Grid, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Rule from "./RuleInput";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
const InputRuleList = (props) => {
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
    props.setRules((prev) => [
      ...prev,
      { rule: "", description: "", editRuleOpen: true },
    ]);
  };

  return (
    <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
      <Stack alignItems="flex-start" spacing={1}>
        <Grid container>
          {props.rules &&
            rules.map((rule, index) => (
              <Grid item xs={12} key={rule + index}>
                <Rule
                  rule={rule.rule}
                  description={rule.description}
                  index={index}
                  setRule={setRule(index)}
                />
              </Grid>
            ))}
        </Grid>

        <Button onClick={createNewRule} color="button">
          <AddCircleTwoToneIcon color="button" />
          <Typography variant="body1">Add Rule</Typography>
        </Button>
      </Stack>
    </Box>
  );
};

export default InputRuleList;
