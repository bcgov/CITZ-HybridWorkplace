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

const GET_POSTS = "CITZ-HYBRIDWORKPLACE/POST/GET_COMMUNITIES";
const ADD_POST = "CITZ-HYBRIDWORKPLACE/POST/ADD_COMMUNITY";
<<<<<<< HEAD
const REMOVE_POST = "CITZ-HYBRIDWORKPLACE/POST/REMOVE_POST";
=======
>>>>>>> 7fabcc5... Created files to start on tagging
const ADD_TAG = "CITZ-HYBRIDWORKPLACE/POST/ADD_TAG";
const REMOVE_TAG = "CITZ-HYBRIDWORKPLACE/POST/REMOVE_TAG";

const noTokenText = "Trying to access accessToken, no accessToken in store";

const apiURI = !window._env_.REACT_APP_LOCAL_DEV
  ? `${window._env_.REACT_APP_API_REF}`
  : `http://${window._env_.REACT_APP_API_REF}:${window._env_.REACT_APP_API_PORT}`;

export const getPosts = () => async (dispatch, getState) => {
  let successful = true;

  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await fetch(`${apiURI}/api/post`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

    const posts = await response.json();

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

export const createPost = (postData) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await fetch(`${apiURI}/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: postData.title,
        message: postData.message,
        creator: postData.creator,
        community: postData.community,
      }),
    });

    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

    const data = await response.json();

    dispatch({
      type: ADD_POST,
      payload: data,
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

    const response = await fetch(`${apiURI}/api/post/${postId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

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

    const response = await fetch(
      `${apiURI}/api/post/flags/${postId}?flag=${flag}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

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

    const response = await fetch(
      `${apiURI}/api/post/tags/${postId}?tag=${tag}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

    createSuccess(`Successfully Tagged Post`)(dispatch);
  } catch (err) {
    console.error(err);
    successful = false;
    createError("Unexpected error occurred")(dispatch);
  } finally {
    return successful;
  }
};

const initialState = {
  items: [], //communitys
  item: {}, //single community
};

export function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        items: action.payload,
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
    case ADD_TAG:
      return {};
    default:
      return state;
  }
}
