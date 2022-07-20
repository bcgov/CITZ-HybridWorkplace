import { connect } from "react-redux";
import { openFlagPostModal } from "../redux/ducks/modalDuck";
import { openDeletePostModal } from "../redux/ducks/modalDuck";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost } from "../redux/ducks/postDuck";
import CommentsList from "../components/CommentsList";
import CreateComment from "../components/CreateComment";
import Post from "../components/Post";
import LoadingPage from "./LoadingPage";
import { Divider, Typography, Box } from "@mui/material";
import EditCommunityModal from "../components/modals/EditCommunityModal";
import EditPostModal from "../components/modals/EditPostModal";
import DeletePostModal from "../components/modals/DeletePostModal";
import FlagPostModal from "../components/modals/FlagPostModal";
import ResolveFlagsModal from "../components/modals/ResolveFlagsModal";

const SingularPost = (props) => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      if (await props.getPost(id)) {
        setLoading(false);
      }
    })();
  }, []);

  const deletePostSideEffect = () => {
    navigate("/home");
  };

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
      <EditPostModal />
      <DeletePostModal sideEffect={deletePostSideEffect} />
      <FlagPostModal />
      <ResolveFlagsModal />
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
