import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { closePromoteUserModal } from "../../redux/ducks/modalDuck";

export const PromoteUserModal = (props) => {
  return (
    <Dialog open={props.open} onClose={props.closePromoteUserModal}>
      <DialogTitle fontWeight={600}>Promote User</DialogTitle>
      <DialogContent></DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({ open: state.modal.promoteUser.open });

const mapDispatchToProps = { closePromoteUserModal };

export default connect(mapStateToProps, mapDispatchToProps)(PromoteUserModal);
