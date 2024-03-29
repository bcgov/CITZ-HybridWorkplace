import { createTheme } from "@mui/material";

export const getDarkModePreference = () => {
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

const lightModeColors = {
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
  button: {
    main: "#003366",
  },
  card: {
    main: "#ffffff",
  },
  backgroundSecondary: {
    main: "rgba(220, 220, 220, .5)",
  },
  onlineStatus: {
    main: "#27CC13",
  },
  offlineStatus: {
    main: "#F4281C",
  },
};
const darkModeColors = {
  primary: {
    main: "#014587",
  },
  secondary: {
    main: "#FDB913",
  },
  neutral: {
    main: "#fff",
  },
  banner: {
    main: "#395988",
  },
  button: {
    main: "#057ff5",
  },
  card: {
    main: "#121212",
  },
  backgroundSecondary: {
    main: "rgba(220, 220, 220, .1)",
  },
  onlineStatus: {
    main: "#27CC13",
  },
  offlineStatus: {
    main: "#F4281C",
  },
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
    ...(getDarkModePreference() === "light" ? lightModeColors : darkModeColors),
    BCBlue: { main: "#003366" },
    BCYellow: { main: "#e3a82b" },
  },
  typography: {
    fontFamily: "BCSans",
  },
});
