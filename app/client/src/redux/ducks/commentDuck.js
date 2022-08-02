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

// All dispatches are handled in postDuck.js as comments are stored on the post object

import { createSuccess, createError } from "./alertDuck";
import hwp_axios from "../../axiosInstance";
import {
  reshapeCommentForFrontend,
  reshapeCommentsForFrontend,
} from "../../helperFunctions/commentHelpers";

export const SET_COMMENTS = "CITZ-HYBRIDWORKPLACE/COMMENT/SET_COMMENTS";
export const ADD_COMMENT = "CITZ-HYBRIDWORKPLACE/COMMENT/ADD_COMMENT";
export const EDIT_COMMENT = "CITZ-HYBRIDWORKPLACE/COMMENT/EDIT_COMMENT";
export const REMOVE_COMMENT = "CITZ-HYBRIDWORKPLACE/COMMENT/REMOVE_COMMENT";
export const REPLY_TO_COMMENT = "CITZ-HYBRIDWORKPLACE/COMMENT/REPLY_TO_COMMENT";
export const SET_COMMENT_REPLIES =
  "CITZ-HYBRIDWORKPLACE/COMMENT/SET_COMMENT_REPLIES";
export const UPVOTE_COMMENT = "CITZ-HYBRIDWORKPLACE/COMMENT/UPVOTE_COMMENT";
export const DOWNVOTE_COMMENT = "CITZ-HYBRIDWORKPLACE/COMMENT/DOWNVOTE_COMMENT";
export const UPVOTE_REPLY = "CITZ-HYBRIDWORKPLACE/COMMENT/UPVOTE_REPLY";
export const DOWNVOTE_REPLY = "CITZ-HYBRIDWORKPLACE/COMMENT/DOWNVOTE_REPLY";
export const REMOVE_COMMENT_VOTE =
  "CITZ-HYBRIDWORKPLACE/COMMENT/REMOVE_COMMENT_VOTE";
export const REMOVE_REPLY = "CITZ-HYBRIDWORKPLACE/COMMENT/REMOVE_REPLY";
export const EDIT_REPLY = "CITZ-HYBRIDWORKPLACE/COMMENT/EDIT_REPLY";

const noTokenText = "Trying to access accessToken, no accessToken in store";

export const getComments = (postId) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/comment/post/${postId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    const comments = reshapeCommentsForFrontend(
      authState.user.id,
      response.data
    );

    dispatch({
      type: SET_COMMENTS,
      payload: { comments },
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const createComment = (post, comment) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.post(
      `/api/comment`,
      {
        post: post._id,
        message: comment,
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

    const returnedComment = reshapeCommentForFrontend(
      authState.user.id,
      response.data
    );

    dispatch({
      type: ADD_COMMENT,
      payload: returnedComment,
    });
  } catch (err) {
    console.error(err);
    successful = false;
    createError(err.response.data)(dispatch);
  } finally {
    return successful;
  }
};

export const editComment = (comment, replyTo) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(
      `/api/comment/${comment.id}`,
      {
        message: comment.message,
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
      type: replyTo ? EDIT_REPLY : EDIT_COMMENT,
      payload: {comment, replyTo},
    });
  } catch (err) {
    console.error(err);
    successful = false;
    createError(err.response.data)(dispatch);
  } finally {
    return successful;
  }
};

export const deleteComment =
  (commentId, replyTo) => async (dispatch, getState) => {
    let successful = true;
    try {
      //TODO: Throw error if given delete is not in list of available deletes
      if (commentId === "") throw new Error("Error: Invalid Input");
      const authState = getState().auth;
      const token = authState.accessToken;

      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.delete(`/api/comment/${commentId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          dispatch,
        },
      });

      dispatch({
        type: replyTo ? REMOVE_REPLY : REMOVE_COMMENT,
        payload: { commentId, replyTo },
      });
    } catch (err) {
      console.error(err);
      successful = false;
      createError(err.response.data)(dispatch);
    } finally {
      return successful;
    }
  };

export const replyToComment =
  (commentId, reply) => async (dispatch, getState) => {
    let successful = true;
    try {
      if (commentId === "") throw new Error("Error: Invalid Input");
      const authState = getState().auth;
      const token = authState.accessToken;

      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.post(
        `/api/comment/reply/${commentId}`,
        {
          message: reply,
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
        type: REPLY_TO_COMMENT,
        payload: { commentId, comment: response.data },
      });
    } catch (err) {
      console.error(err);
      successful = false;
      createError(err.response.data)(dispatch);
    } finally {
      return successful;
    }
  };

export const getCommentReplies = (commentId) => async (dispatch, getState) => {
  let successful = true;
  try {
    if (commentId === "") throw new Error("Error: Invalid Input");
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/comment/reply/${commentId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    const replies = reshapeCommentsForFrontend(
      authState.user.id,
      response.data
    );

    dispatch({
      type: SET_COMMENT_REPLIES,
      payload: { commentId, comments: replies },
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const flagComment = (commentId, flag) => async (dispatch, getState) => {
  let successful = true;
  try {
    //TODO: Check for flag in list of available flags
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.post(
      `/api/comment/flags/${commentId}?flag=${flag}`,
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
    createSuccess(`Successfully flagged post for reason: ${flag}`)(dispatch);
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const upvoteComment =
  (commentId, replyTo) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;
      const userId = authState.user.id;

      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.patch(
        `/api/comment/vote/${commentId}?vote=up`,
        {
          id: commentId,
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
        type: replyTo ? UPVOTE_REPLY : UPVOTE_COMMENT,
        payload: { commentId, userId, replyTo },
      });
    } catch (err) {
      console.error(err);
      successful = false;
    } finally {
      return successful;
    }
  };

export const downvoteComment =
  (commentId, replyTo) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;
      const userId = authState.user.id;

      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.patch(
        `/api/comment/vote/${commentId}?vote=down`,
        {
          id: commentId,
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
        type: replyTo ? DOWNVOTE_REPLY : DOWNVOTE_COMMENT,
        payload: { commentId, userId, replyTo },
      });
    } catch (err) {
      console.error(err);
      successful = false;
    } finally {
      return successful;
    }
  };

const initialState = {};

export function commentReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
