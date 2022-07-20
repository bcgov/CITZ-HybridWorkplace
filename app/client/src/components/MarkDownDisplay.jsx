import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import { getDarkModePreference } from "../theme";

const MarkDownDisplay = (props) => {
  const [darkModePreference] = useState(getDarkModePreference());
  return (
    <div data-color-mode={darkModePreference}>
      <MDEditor.Markdown
        source={props.message}
        style={{
          backgroundColor: darkModePreference === "dark" && "#121212",
        }}
      ></MDEditor.Markdown>
    </div>
  );
};

export default MarkDownDisplay;
