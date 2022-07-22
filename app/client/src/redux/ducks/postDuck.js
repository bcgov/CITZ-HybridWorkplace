/* 
 Copyright © 2022 Province of British Columbia

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Application entry point
 * @author [Zach Bourque](zachbourque01@gmai.com)
 * @module
 */

import { createSuccess, createError } from "./alertDuck";
import hwp_axios from "../../axiosInstance";
import {
  SET_COMMENTS,
  ADD_COMMENT,
  DOWNVOTE_COMMENT,
  REMOVE_COMMENT,
  REMOVE_COMMENT_VOTE,
  REPLY_TO_COMMENT,
  SET_COMMENT_REPLIES,
  UPVOTE_COMMENT,
} from "./commentDuck";

export const GET_POSTS = "CITZ-HYBRIDWORKPLACE/POST/GET_POSTS";
const SET_USER_POSTS = "CITZ-HYBRIDWORKPLACE/POST/SET_USER_POSTS";
const GET_POST = "CITZ-HYBRIDWORKPLACE/POST/GET_POST";
const ADD_POST = "CITZ-HYBRIDWORKPLACE/POST/ADD_POST";
const REMOVE_POST = "CITZ-HYBRIDWORKPLACE/POST/REMOVE_POST";
export const EDIT_POST = "CITZ-HYBRIDWORKPLACE/POST/EDIT_POST";
const TAG_POST = "CITZ-HYBRIDWORKPLACE/POST/TAG_POST";
const UNTAG_POST = "CITZ-HYBRIDWORKPLACE/POST/UNTAG_POST";

const noTokenText = "Trying to access accessToken, no accessToken in store";

const getUserTag = (post, userId) => {
  try {
    return post.tags.find((tag) => tag.taggedBy.find((user) => user === userId))
      ?.tag;
  } catch (err) {
    console.error(err);
  }
};

export const getPosts = () => async (dispatch, getState) => {
  let successful = true;

  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/post`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    //Modifies each post and adds a userTag field which shows the tag the user has given it
    const posts = response.data.map((post) => ({
      ...post,
      userTag: getUserTag(post, authState.user.id),
    }));

    dispatch({
      type: GET_POSTS,
      payload: posts,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const getUserPosts = (postCreator) => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/post?username=${postCreator}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });
    dispatch({
      type: SET_USER_POSTS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const getPost = (postId) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/post/${postId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
        id: postId,
      },
    });

    //Modifies each post and adds a userTag field which shows the tag the user has given it
    const post = {
      ...response.data,
      userTag: getUserTag(response.data, authState.user.id),
    };

    dispatch({
      type: GET_POST,
      payload: post,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const createPost = (postData) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.post(
      `/api/post`,
      {
        title: postData.title,
        message: postData.message,
        creator: postData.creator,
        community: postData.community,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          dispatch,
        },
      }
    );

    dispatch({
      type: ADD_POST,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
    createError(err.response.data)(dispatch);
  } finally {
    return successful;
  }
};

export const deletePost = (postId) => async (dispatch, getState) => {
  let successful = true;
  try {
    //TODO: Throw error if given delete is not in list of available deletes
    if (postId === "") throw new Error("Error: Invalid Input");
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.delete(`/api/post/${postId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    dispatch({
      type: REMOVE_POST,
      payload: postId,
    });
    createSuccess(`Successfully Deleted Post`)(dispatch);
  } catch (err) {
    console.error(err);
    successful = false;
    createError("Unexpected error occurred")(dispatch);
  } finally {
    return successful;
  }
};

export const editPost = (newPost) => async (dispatch, getState) => {
  let successful = true;
  try {
    //TODO: Throw error if given delete is not in list of available deletes
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(
      `/api/post/${newPost.id}`,
      {
        ...newPost,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          dispatch,
        },
      }
    );
    dispatch({
      type: EDIT_POST,
      payload: newPost,
    });
    createSuccess(`Successfully Edited Post`)(dispatch);
  } catch (err) {
    console.error(err);
    successful = false;
    createError(err.response.data)(dispatch);
  } finally {
    return successful;
  }
};

export const flagPost = (postId, flag) => async (dispatch, getState) => {
  let successful = true;
  try {
    //TODO: Throw error if given flag is not in list of available flags
    if (flag === "") throw new Error("Error: Invalid Input");
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.post(
      `/api/post/flags/${postId}?flag=${flag}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          dispatch,
        },
      }
    );

    createSuccess(`Successfully Flagged Post For Reason: ${flag}`)(dispatch);
  } catch (err) {
    console.error(err);
    successful = false;
    createError(err.response.data)(dispatch);
  } finally {
    return successful;
  }
};

export const tagPost = (postId, tag) => async (dispatch, getState) => {
  let successful = true;
  try {
    if (tag === "") throw new Error("Error: Invalid Input");
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.post(
      `/api/post/tags/${postId}?tag=${tag}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          dispatch,
        },
      }
    );

    dispatch({ type: TAG_POST, payload: { postId, tag } });

    createSuccess(`Successfully Tagged Post`)(dispatch);
  } catch (err) {
    console.error(err);
    successful = false;
    createError(err.response.data)(dispatch);
  } finally {
    return successful;
  }
};

export const unTagPost = (postId, tag) => async (dispatch, getState) => {
  let successful = true;
  try {
    if (tag === "") throw new Error("Error: Invalid Input");
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.delete(
      `/api/post/tags/${postId}?tag=${tag}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          dispatch,
        },
      }
    );

    dispatch({
      type: UNTAG_POST,
      payload: { postId },
    });
    createSuccess(`Successfully Untagged Post`)(dispatch);
  } catch (err) {
    console.error(err);
    successful = false;
    createError(err.response.data)(dispatch);
  } finally {
    return successful;
  }
};

const initialState = {
  currentPostIndex: -1,
  items: [],
};

export function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        items: action.payload,
      };
    case SET_USER_POSTS:
      return (() => {
        const newState = { ...state };
        newState.items = [
          ...newState.items,
          ...action.payload.filter(
            (post) =>
              !newState.items.find((statePost) => statePost._id === post._id)
          ),
        ];
        return newState;
      })();
    case GET_POST:
      return (() => {
        const newState = { ...state };
        const postIndex = newState.items.findIndex(
          (post) => post._id === action.payload._id
        );
        if (postIndex !== -1) {
          newState.items[postIndex] = action.payload;
          newState.currentPostIndex = postIndex;
        } else {
          newState.items.unshift(action.payload);
          newState.currentPostIndex = 0;
        }
        return newState;
      })();
    case ADD_POST:
      return {
        ...state,
        items: [action.payload, ...state.items],
      };
    case REMOVE_POST:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };
    case EDIT_POST:
      return {
        ...state,
        items: state.items.map((post) =>
          post._id === action.payload.id
            ? {
                ...post,
                ...action.payload,
              }
            : post
        ),
      };
    case TAG_POST:
      return {
        ...state,
        items: state.items.map((element) =>
          element._id === action.payload.postId
            ? { ...element, userTag: action.payload.tag }
            : element
        ),
      };
    case UNTAG_POST:
      return {
        ...state,
        items: state.items.map((element) =>
          element._id === action.payload.postId
            ? { ...element, userTag: undefined }
            : element
        ),
      };
    // COMMENTS
    case SET_COMMENTS:
      return {
        ...state,
        items: state.items.map((post, index) =>
          index === state.currentPostIndex
            ? {
                ...post,
                comments: action.payload.comments,
              }
            : post
        ),
      };
    case ADD_COMMENT:
      return {
        ...state,
        items: state.items.map((post, index) =>
          index === state.currentPostIndex
            ? {
                ...post,
                comments: [action.payload, ...post.comments],
              }
            : post
        ),
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        items: state.items.map((post, index) =>
          index === state.currentPostIndex
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment._id !== action.payload
                ),
              }
            : post
        ),
      };
    case REPLY_TO_COMMENT:
      return {
        ...state,
        items: state.items.map((post, index) =>
          index === state.currentPostIndex
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? {
                        ...comment,
                        replies: [
                          action.payload.comment,
                          ...(comment.replies ?? []),
                        ],
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    case SET_COMMENT_REPLIES:
      return {
        ...state,
        items: state.items.map((post, index) =>
          index === state.currentPostIndex
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? {
                        ...comment,
                        replies: action.payload.comments,
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    case UPVOTE_COMMENT:
      return {
        ...state,
        items: state.items.map((post, index) =>
          index === state.currentPostIndex
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? // If comment._id is the id of the comment we're upvoting, do the following logic
                      {
                        ...comment,
                        /* 
                  The upvote/downvote button work as a switch.
                  If upvote is already clicked and you click it again, it will unclick upvote,
                  and same with downvote.
                  */
                        userVote:
                          comment.userVote === "down" || !comment.userVote
                            ? "up"
                            : null,
                        votes: (() => {
                          if (comment.userVote === "down") {
                            return comment.votes + 2;
                          }
                          if (comment.userVote === "up") {
                            return comment.votes - 1;
                          }
                          return comment.votes + 1;
                        })(),
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    case DOWNVOTE_COMMENT:
      return {
        ...state,
        items: state.items.map((post, index) =>
          index === state.currentPostIndex
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? // If comment._id is the id of the comment we're upvoting, do the following logic
                      {
                        ...comment,
                        /* 
                  The upvote/downvote button work as a switch.
                  If upvote is already clicked and you click it again, it will unclick upvote,
                  and same with downvote.
                  */
                        userVote:
                          comment.userVote === "up" || !comment.userVote
                            ? "down"
                            : null,
                        votes: (() => {
                          if (comment.userVote === "up") {
                            return comment.votes - 2;
                          }
                          if (comment.userVote === "down") {
                            return comment.votes + 1;
                          }
                          return comment.votes - 1;
                        })(),
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    default:
      return state;
  }
}
