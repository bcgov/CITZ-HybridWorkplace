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
 * @author [Brandon Bouchard](brandonjbouchard@gmail.com)
 * @module
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import "./header.css";
import BCLogo from "./icons/BCLogo.svg";
import { connect } from "react-redux";
import { useTheme } from "@emotion/react";

import { getUser } from "../redux/ducks/userDuck";
import AvatarIcon from "../components/AvatarIcon";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      content: '""',
    },
  },
}));

const menuId = "account-avatar";
// props: {darkMode, setDarkMode}
// <SideMenu darkMode={darkMode} setDarkMode={setDarkMode}/>
const Header = (props) => {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = React.useState({ right: false });

  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setMenuOpen({ ...menuOpen, [anchor]: open });
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        content: '""',
      },
    },
  }));

  const menuId = "account-avatar";

  const menuItems = [
    {
      itemText: "Home",
      itemIcon: <HomeIcon />,
      itemLink: "/",
    },
    {
      itemText: "Profile",
      itemIcon: <PersonIcon />,
      itemLink: `/profile/${props.auth.user.username}`,
    },
    {
      itemText: "Communities",
      itemIcon: <PeopleIcon />,
      itemLink: "/communities",
    },
    {
      itemText: "About",
      itemIcon: <QuestionMarkIcon />,
      itemLink: "/about",
    },
    {
      itemText: "Log Out",
      itemIcon: <LogoutIcon />,
      itemLink: "/logout",
    },
  ];
  const menu = () => (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        zIndex: 1000,
      }}
    >
      <List onClick={toggleDrawer("right", false)}>
        {menuItems.map((menuItem) => (
          <div>
            <ListItem key={menuItem.itemText} disablePadding>
              <ListItemButton
                divider
                onClick={() => navigate(menuItem.itemLink)}
                value={menuItem.itemLink}
              >
                <ListItemIcon>{menuItem.itemIcon}</ListItemIcon>
                <ListItemText primary={menuItem.itemText} />
              </ListItemButton>
            </ListItem>
          </div>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    props.getUser();
  }, [props.auth.accessToken]);

  props.user.initials = props.user.lastName
    ? `${props.user.firstName?.charAt(0)}${props.user.lastName?.charAt(0)}`
    : props.user.firstName?.charAt(0);

  return (
    <AppBar
      sx={{
        borderBottom: 3,
        borderColor: "secondary.main",
        backgroundColor: "BCBlue.main",
      }}
      position="static"
      enableColorOnDark
    >
      <Toolbar>
        <Box
          sx={{
            ml: 3,
          }}
        >
          <IconButton onClick={() => navigate(`/`)} disableRipple>
            <Icon
              sx={{
                width: "7em",
                height: "auto",
              }}
            >
              <img src={BCLogo} />
            </Icon>
          </IconButton>
        </Box>
        <Typography
          variant="h4"
          noWrap
          sx={{
            display: { xs: "none", sm: "block" },
            fontWeight: 600,
            color: "white",
          }}
        >
          The Neighbourhood
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        {props.auth.accessToken !== "" && (
          <>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                mr: "2%",
              }}
            >
              <IconButton
                onClick={() => navigate(`/profile/${props.auth.user.username}`)}
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <AvatarIcon
                    type={props.user.avatar?.avatarType ?? ""}
                    initials={props.user?.initials ?? ""}
                    image={props.user.avatar?.image ?? ""}
                    gradient={props.user.avatar?.gradient ?? ""}
                    colors={props.user.avatar?.colors ?? {}}
                    size={45}
                    shadow={true}
                  />
                </StyledBadge>
              </IconButton>
            </Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer("right", true)}
              onKeyDown={toggleDrawer("right", true)}
              sx={{ mr: 2 }}
            >
              <MenuRoundedIcon fontSize="large" />
            </IconButton>
            <Drawer
              anchor="right"
              open={menuOpen["right"]}
              onClose={toggleDrawer("right", false)}
            >
              {menu()}
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  user: state.self.user,
  auth: state.auth,
});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(Header);
