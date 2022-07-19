import { InputLabel, Stack } from "@mui/material";
import { Box } from "@mui/system";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import { getDarkModePreference } from "../theme";

const MarkDownEditor = (props) => {
  const [darkModePreference] = useState(getDarkModePreference());

  return (
    <Box data-color-mode={darkModePreference}>
      <Stack spacing={0.5}>
        <InputLabel htmlFor="message-input" error={props.error}>
          {props.label}
        </InputLabel>
        <Box
          sx={{
            border: 1.95,
            borderColor: props.error
              ? "rgb(244, 67, 54)"
              : "rgba(255, 255, 255, 0.5)",
            borderRadius: "1%",
          }}
        >
          <MDEditor
            id="message-input"
            value={props.value}
            onChange={props.onChange}
            preview={props.preview ?? "edit"}
            style={
              darkModePreference === "dark" && {
                backgroundColor: "rgba(12,12,12,0.0)",
              }
            }
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default MarkDownEditor;
