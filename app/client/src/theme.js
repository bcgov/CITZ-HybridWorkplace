import { createTheme } from "@mui/material";

const getDarkModePreference = () => {
  let darkModePref = localStorage.getItem("hwp-darkmode");
  if (darkModePref === "system") {
    darkModePref = getSystemDarkModePreference();
  }
  return darkModePref ?? "light";
};

const getSystemDarkModePreference = () => {
  return window.matchMedia("(prefers-color-scheme:dark)").matches
    ? "dark"
    : "light";
};

export const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
  },
  palette: {
    mode: getDarkModePreference(),
    primary: {
      main: "#003366",
    },
    secondary: {
      main: "#FDB913",
    },
    neutral: {
      main: "#313132",
    },
    banner: {
      main: "#395988",
    },
  },
  typography: {
    fontFamily: "BCSans",
  },
});
