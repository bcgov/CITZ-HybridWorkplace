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

const GET_POSTS = "CITZ-HYBRIDWORKPLACE/POST/GET_POSTS";
const GET_POST = "CITZ-HYBRIDWORKPLACE/POST/GET_POST";
const ADD_POST = "CITZ-HYBRIDWORKPLACE/POST/ADD_POST";
const REMOVE_POST = "CITZ-HYBRIDWORKPLACE/POST/REMOVE_POST";
const TAG_POST = "CITZ-HYBRIDWORKPLACE/POST/TAG_POST";
const UNTAG_POST = "CITZ-HYBRIDWORKPLACE/POST/UNTAG_POST";
const SET_COMMENTS = "CITZ-HYBRIDWORKPLACE/POST/SET_COMMENTS";
const ADD_COMMENT = "CITZ-HYBRIDWORKPLACE/POST/ADD_COMMENT";

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
    createError("Unexpected error occurred")(dispatch);
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
    createError("Unexpected error occurred")(dispatch);
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
    createError("Unexpected error occurred")(dispatch);
  } finally {
    return successful;
  }
};

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

    dispatch({
      type: SET_COMMENTS,
      payload: { comments: response.data },
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
        post,
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

    dispatch({
      type: ADD_COMMENT,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

const initialState = {
  items: [], //posts
  item: {}, //single post
};

export function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        items: action.payload,
      };
    case GET_POST:
      return {
        ...state,
        item: action.payload,
      };
    case ADD_POST:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case REMOVE_POST:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
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
    case SET_COMMENTS:
      return {
        ...state,
        item: { ...state.item, comments: action.payload.comments },
      };
    case ADD_COMMENT:
      return {
        ...state,
        item: {
          ...state.item,
          comments: [action.payload, ...state.item.comments],
        },
      };
    default:
      return state;
  }
}
