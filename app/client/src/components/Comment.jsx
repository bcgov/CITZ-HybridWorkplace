import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import React from "react";
import { connect } from "react-redux";

export const Comment = (props) => {
  return (
    <Card style={{ margin: 10 }}>
      <CardHeader
        title={
          <Typography variant="body1">
            {props.comment.creatorName || "Unknown Commenter"}
          </Typography>
        }
        avatar={<Avatar />}
      />
      <CardContent>
        <Typography variant="body2">{props.comment.message}</Typography>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
