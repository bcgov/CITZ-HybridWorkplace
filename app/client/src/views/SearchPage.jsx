import { TabContext, TabPanel } from "@mui/lab";
import {
  Card,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarIcon from "../components/AvatarIcon";
import Community from "../components/Community";
import Post from "../components/Post";
import { search } from "../redux/ducks/searchDuck";
import LoadingPage from "./LoadingPage";

const UserCard = (props) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/profile/${props.user.username}`);
  };
  return (
    <Card sx={{ cursor: "pointer" }} onClick={handleCardClick}>
      <CardHeader
        title={props.user.username}
        subheader={props.user.fullName}
        avatar={
          <AvatarIcon
            type={props.user.avatar?.avatarType ?? ""}
            initials={
              props.user?.initials ??
              props.user.username.charAt(0).toUpperCase()
            }
            image={props.user.avatar?.image ?? ""}
            gradient={props.user.avatar?.gradient ?? ""}
            colors={props.user.avatar?.colors ?? {}}
            size={50}
          />
        }
      />
    </Card>
  );
};

export const SearchPage = (props) => {
  // Data and State
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [loading, setLoading] = useState(true);

  const [tabValue, setTabValue] = useState("1");

  const handleTabValueChange = (e, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    (async () => {
      await props.search(query);
      setLoading(false);
    })();
  }, [window.location.href]);

  return loading ? (
    <LoadingPage />
  ) : (
    <TabContext value={tabValue}>
      <Box>
        <Stack spacing={2}>
          <Typography variant="h4">Results for "{query}"</Typography>
          <Typography variant="body1">
            {props.searchData.users.length +
              props.searchData.posts.length +
              props.searchData.communities.length}{" "}
            results
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabValueChange}
            aria-label="basic tabs example"
          >
            <Tab
              label={
                <Typography
                  variant="body1"
                  sx={{
                    color: tabValue === "1" ? "button.main" : "neutral.main",
                  }}
                >{`Users: ${props.searchData.users.length}`}</Typography>
              }
              value="1"
            />
            <Tab
              label={
                <Typography
                  variant="body1"
                  sx={{
                    color: tabValue === "2" ? "button.main" : "neutral.main",
                  }}
                >{`Posts: ${props.searchData.posts.length}`}</Typography>
              }
              value="2"
            />
            <Tab
              label={
                <Typography
                  variant="body1"
                  sx={{
                    color: tabValue === "3" ? "button.main" : "neutral.main",
                  }}
                >{`Communities: ${props.searchData.communities.length}`}</Typography>
              }
              value="3"
            />
          </Tabs>
        </Stack>
      </Box>
      <TabPanel value="1">
        <Stack spacing={1}>
          {props.searchData.users.length ? (
            props.searchData.users.map((user) => <UserCard user={user} />)
          ) : (
            <Typography variant="body1">No users to display</Typography>
          )}
        </Stack>
      </TabPanel>
      <TabPanel value="2">
        <Stack spacing={1}>
          {props.searchData.posts.length ? (
            props.searchData.posts.map((post) => <Post post={post} />)
          ) : (
            <Typography variant="body1">No posts to display</Typography>
          )}
        </Stack>
      </TabPanel>
      <TabPanel value="3">
        <Stack spacing={1}>
          {props.searchData.communities.length ? (
            props.searchData.communities.map((community) => (
              <Community community={community} hideJoinButton />
            ))
          ) : (
            <Typography variant="body1">No communities to display</Typography>
          )}
        </Stack>
      </TabPanel>
    </TabContext>
  );
};

const mapStateToProps = (state) => ({ searchData: state.search });

const mapDispatchToProps = { search };

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
