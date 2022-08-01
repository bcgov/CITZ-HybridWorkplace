import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { HomeRounded, WebRounded } from "@mui/icons-material";

const Croutons = (props) => {
  const navigate = useNavigate();
  const handleClick = (e) => e.preventDefault();

  return (
    <Box role="presentation" onClick={handleClick} mb={3}>
      {props.profile === true ? (
        <Breadcrumbs>
          <Link
            variant="body2"
            component="button"
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <WebRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            {props.firstCrumb}
          </Typography>
        </Breadcrumbs>
      ) : props.secondCrumb ? (
        <Breadcrumbs>
          <Link
            variant="body2"
            component="button"
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            variant="body2"
            component="button"
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate(`/community/${props.firstCrumb}`)}
          >
            <WebRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            {props.firstCrumb}
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <WebRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            {props.secondCrumb}
          </Typography>
        </Breadcrumbs>
      ) : !props.firstCrumb ? (
        <Breadcrumbs>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <HomeRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Typography>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs>
          <Link
            variant="body2"
            component="button"
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <WebRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            {props.firstCrumb}
          </Typography>
        </Breadcrumbs>
      )}
    </Box>
  );
};

export default Croutons;
