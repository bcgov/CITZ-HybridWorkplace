import { connect } from "react-redux";
import { openFlagPostModal } from "../redux/ducks/modalDuck";
import { openDeletePostModal } from "../redux/ducks/modalDuck";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../redux/ducks/postDuck";
import CommentsList from "../components/CommentsList";
import CreateComment from "../components/CreateComment";
import Post from "../components/Post";
import LoadingPage from "./LoadingPage";
import { Divider, Typography, Box } from "@mui/material";

const SingularPost = (props) => {
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      if (await props.getPost(id)) {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <Box key={props.post._id} sx={{ pb: 20 }}>
          <Post post={props?.post} isPostPage />
          <Typography variant="h6" sx={{ marginTop: 3 }}>
            Comments
          </Typography>
          <Divider sx={{ marginBottom: 3 }} />
          <CreateComment post={props.post} />
          <CommentsList comments={props.post.comments} />
        </Box>
      )}
    </>
  );
};

SingularPost.propTypes = {};

const mapStateToProps = (state) => ({
  post: state.posts.item,
});

const mapActionsToProps = {
  openFlagPostModal,
  openDeletePostModal,
  getPost,
};

export default connect(mapStateToProps, mapActionsToProps)(SingularPost);
