import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { openFlagPostModal } from "../redux/ducks/flagDuck";
import { useState } from "react";

const Post = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { post } = props;

  const handleFlagPostClick = () => {
    props.openFlagPostModal(post);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <div key={post._id}>
      <Paper
        sx={{
          px: 1,
          py: 0,
          margin: "auto",
        }}
        variant="outlined"
        square
      >
        <Card>
          <CardHeader
            action={
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
                    <MenuItem onClick={handleFlagPostClick}>
                      <ListItemIcon>
                        <FlagIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Flag</ListItemText>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            }
            title={<Typography variant="h4">{post.title}</Typography>}
          />
          <CardContent>
            <Typography variant="body1">{post.message}</Typography>
          </CardContent>
        </Card>
      </Paper>
    </div>
  );
};

Post.propTypes = {
  joinCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.flags.flagPost.open,
});

const mapActionsToProps = {
  openFlagPostModal,
};

export default connect(mapStateToProps, mapActionsToProps)(Post);
