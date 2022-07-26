import {
  Card,
  Box,
  Stack,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
// import FlagTwoToneIcon from "@mui/icons-material/FlagTwoTone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import GroupsIcon from "@mui/icons-material/Groups";
import FeedIcon from "@mui/icons-material/Feed";

import { useState, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { openFlagCommunityModal } from "../redux/ducks/modalDuck";
import { openDeleteCommunityModal } from "../redux/ducks/modalDuck";
import JoinButton from "./JoinButton";
import moment from "moment";
import MarkDownDisplay from "./MarkDownDisplay";

const Community = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const { community } = props;
  const maxDisplayedTitleLength = 65;

  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  // Show "NEW" badge on communities created after sinceDateUTC
  const date = useQuery().get("sinceDateUTC");

  const dateQueryFormatted = moment(moment(date, "MMMM Do YYYY").toDate());
  const communityCreatedFormatted = moment(
    moment(community.createdOn.split(",")[0], "MMMM Do YYYY").toDate()
  );
  const isNewCommunity =
    date &&
    dateQueryFormatted.diff(communityCreatedFormatted, "days", true) < 0;

  // const handleFlagCommunityClick = () => {
  //   props.openFlagCommunityModal(community);
  //   handleMenuClose();
  // };

  const handleDeleteCommunityClick = () => {
    props.openDeleteCommunityModal(community);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleCommunityClick = () => navigate(`/community/${community.title}`);

  const today = moment().format("MMMM Do YYYY");
  const yesterday = moment().subtract(1, "days").format("MMMM Do YYYY");

  // Convert to local time
  let createdOn =
    moment(moment.utc(community.createdOn, "MMMM Do YYYY, h:mm:ss a").toDate())
      .local()
      .format("MMMM Do YYYY, h:mm:ss a") || "";
  // Remove milliseconds
  createdOn = `${createdOn.substring(
    0,
    createdOn.length - 6
  )} ${createdOn.substring(createdOn.length - 2, createdOn.length)}`;
  const splitCreatedOn = createdOn.split(",");

  if (splitCreatedOn[0] === today) createdOn = `Today,${splitCreatedOn[1]}`;
  if (splitCreatedOn[0] === yesterday)
    createdOn = `Yesterday,${splitCreatedOn[1]}`;

  // Convert to local time
  let latestActivity =
    moment(
      moment.utc(community.latestActivity, "MMMM Do YYYY, h:mm:ss a").toDate()
    )
      .local()
      .format("MMMM Do YYYY, h:mm:ss a") || "";
  // Remove milliseconds
  latestActivity = `${latestActivity.substring(
    0,
    latestActivity.length - 6
  )} ${latestActivity.substring(
    latestActivity.length - 2,
    latestActivity.length
  )}`;
  const splitLatestActivity = latestActivity.split(",");

  if (splitLatestActivity[0] === today)
    latestActivity = `Today,${splitLatestActivity[1]}`;
  if (splitLatestActivity[0] === yesterday)
    latestActivity = `Yesterday,${splitLatestActivity[1]}`;

  return (
    <Box
      key={community._id}
      sx={{ mb: "15px", backgroundColor: "transparent" }}
    >
      <Card
        sx={{
          px: 0,
          py: 0,
          margin: "auto",
          borderRadius: "10px",
          boxShadow: 1,
          border: 0,
        }}
        variant="outlined"
        square
      >
        <CardHeader
          sx={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            backgroundColor: "banner.main",
            cursor: "pointer",
            color: "white",
          }}
          onClick={handleCommunityClick}
          action={
            props.username === community.creator && (
              <>
                <IconButton aria-label="settings" onClick={handleMenuOpen}>
                  <MoreVertIcon sx={{ color: "white" }} />
                </IconButton>
                <Menu
                  open={!!anchorEl}
                  onClose={handleMenuClose}
                  anchorEl={anchorEl}
                >
                  <MenuList>
                    {
                      //TODO: Flag Community
                      /* <MenuItem onClick={}>
                    <ListItemIcon>
                      <FlagTwoToneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Flag</ListItemText>
                  </MenuItem> */
                    }
                    <MenuItem onClick={handleDeleteCommunityClick}>
                      <ListItemIcon>
                        <DeleteForeverTwoToneIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            )
          }
          title={
            <Typography variant="h5">
              <b>
                {community.title.length >= maxDisplayedTitleLength
                  ? community.title.substring(0, maxDisplayedTitleLength) +
                    "..."
                  : community.title}
              </b>
            </Typography>
          }
          subheader={
            <Typography size="small" sx={{ pt: "5px" }}>
              Created {createdOn || "Unknown"}
            </Typography>
          }
        />
        <CardContent>
          <MarkDownDisplay message={props.community.description} />
        </CardContent>
        <CardActions>
          <Stack direction="row" spacing={1} width="0.95" alignItems="center">
            <Stack direction="row" spacing={1} sx={{ ml: "5px" }}>
              <Tooltip title={<Typography>Community Members</Typography>} arrow>
                <GroupsIcon sx={{ color: "#898989" }} />
              </Tooltip>
              <Typography color="#898989">
                {community.memberCount || 0}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Tooltip title={<Typography>Community Posts</Typography>} arrow>
                <IconButton
                  disableRipple
                  onClick={handleCommunityClick}
                  sx={{ pr: 0 }}
                >
                  <FeedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography color="#898989">
                {community.postCount || 0}
              </Typography>
            </Stack>
            {props.hideJoinButton || <JoinButton community={community} />}
            <Typography color="#898989">
              Latest Activity: {latestActivity}
            </Typography>
          </Stack>
          {isNewCommunity && (
            <Tooltip
              title={<Typography>New Since: {date} (UTC)</Typography>}
              arrow
            >
              <Chip
                variant="outlined"
                label="NEW"
                sx={{
                  backgroundColor: "#EEBE0B",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "0.9em",
                  boxShadow: 1,
                  border: 0,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

Community.propTypes = {
  username: PropTypes.string.isRequired,
  openFlagCommunityModal: PropTypes.func.isRequired,
  openDeleteCommunityModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  username: state.auth.user.username,
});

const mapActionsToProps = {
  openFlagCommunityModal,
  openDeleteCommunityModal,
};

export default connect(mapStateToProps, mapActionsToProps)(Community);
