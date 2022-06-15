import {
  Card,
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
} from "@mui/material";
import FlagTwoToneIcon from "@mui/icons-material/FlagTwoTone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { openFlagCommunityModal } from "../redux/ducks/modalDuck";
import { openDeleteCommunityModal } from "../redux/ducks/modalDuck";
import { useState } from "react";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import JoinButton from "./JoinButton";
import { useNavigate } from "react-router-dom";

const Community = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const { community } = props;

  const handleFlagCommunityClick = () => {
    props.openFlagCommunityModal(community);
    handleMenuClose();
  };

  const handleDeleteCommunityClick = () => {
    props.openDeleteCommunityModal(community);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleCommunityClick = () => navigate(`/community/${community.title}`);

  return (
    <div key={community._id}>
      <Card
        sx={{
          px: 1,
          py: 0,
          margin: "auto",
        }}
        variant="outlined"
        square
      >
        <CardHeader
          onClick={handleCommunityClick}
          style={{ cursor: "pointer" }}
          action={
            props.username === community.creator && (
              <>
                <IconButton aria-label="settings" onClick={handleMenuOpen}>
                  <MoreVertIcon />
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
          title={<Typography variant="h4">{community.title}</Typography>}
        />
        <h3>{community.title}</h3>
        <p>{community.description}</p>
      </Card>
      <JoinButton community={community} />
    </div>
  );
};

Community.propTypes = {
  joinCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  flagCommunityOpen: state.modal.flagCommunity.open,
  deleteCommunityOpen: state.modal.deleteCommunity.open,
  username: state.auth.user.username,
});

const mapActionsToProps = {
  openFlagCommunityModal,
  openDeleteCommunityModal,
};

export default connect(mapStateToProps, mapActionsToProps)(Community);
