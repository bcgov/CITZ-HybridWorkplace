import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { closeResolveFlagsModal } from "../../redux/ducks/modalDuck";
import { absolvePost, hidePost } from "../../redux/ducks/moderatorDuck";
import Post from "../Post";
import { DataGrid } from "@mui/x-data-grid";

export const ResolveFlagsModal = ({
  post,
  open,
  closeResolveFlagsModal,
  hidePost,
  absolvePost,
}) => {
  const getFlagRows = () => {
    let id = 0;
    const flagInstances = [];
    post.flags?.forEach((flag) =>
      flag.flaggedBy.forEach((username) => {
        flagInstances.push({
          flag: flag.flag,
          username,
          id: ++id,
        });
      })
    );
    return flagInstances;
  };

  const getFlagCountArray = () => {
    return post.flags.map((item) => ({
      flag: item.flag,
      count: item.flaggedBy.length,
    }));
  };

  const dataGridColumns = [
    { field: "username", headerName: "Flagged By", width: 250 },
    { field: "flag", headerName: "Reason", width: 250 },
  ];
  const dataGridRows = getFlagRows();

  const handleHidePostClick = async () => {
    const successful = await hidePost(post._id);
    if (successful) closeResolveFlagsModal();
  };

  const handleAbsolveClick = async () => {
    const successful = await absolvePost(post._id);
    if (successful) closeResolveFlagsModal();
  };

  return (
    <Dialog
      open={open}
      onClose={closeResolveFlagsModal}
      sx={{ zIndex: 500, mb: 5 }}
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Resolve Flags</DialogTitle>
      <DialogContent>
        {Object.keys(post).length !== 0 && (
          <Stack spacing={1}>
            <Post post={post} isPostPage />
            <Divider />
            <Stack spacing={2}>
              <Typography variant="h5">Flags</Typography>
              <Stack direction="row" spacing={2}>
                {getFlagCountArray().map((item) => (
                  <Chip
                    variant="filled"
                    color="error"
                    label={`${item.flag}: ${item.count}`}
                  ></Chip>
                ))}
              </Stack>

              <Box sx={{ height: 300 }}>
                <DataGrid
                  sx={{ accentColor: "button.main" }}
                  columns={dataGridColumns}
                  rows={dataGridRows}
                  disableSelectionOnClick
                />
              </Box>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="button" onClick={closeResolveFlagsModal}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleHidePostClick}>
          Hide Post
        </Button>
        <Button variant="contained" color="button" onClick={handleAbsolveClick}>
          Absolve
        </Button>
      </DialogActions>
      {console.log(post)}
    </Dialog>
  );
};

ResolveFlagsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  post: PropTypes.object.isRequired,
  closeResolveFlagsModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.modal.resolveFlags.open,
  post: state.modal.resolveFlags.post,
});

const mapDispatchToProps = { closeResolveFlagsModal, hidePost, absolvePost };

export default connect(mapStateToProps, mapDispatchToProps)(ResolveFlagsModal);
