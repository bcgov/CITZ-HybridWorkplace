import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";

const Post = ({ post }) => {
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
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
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

export default Post;
