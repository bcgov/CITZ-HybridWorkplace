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
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @module
 */

import hwp_axios from "../../axiosInstance";

const SET_COMMUNITIES = "CITZ-HYBRIDWORKPLACE/COMMUNITY/SET_COMMUNITIES";
const GET_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/GET_COMMUNITY";
const EDIT_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/GET_COMMUNITY";
const SET_USERS_COMMUNITIES =
  "CITZ-HYBRIDWORKPLACE/COMMUNITY/SET_USERS_COMMUNITIES";
const ADD_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/ADD_COMMUNITY";
const JOIN_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/JOIN_COMMUNITY";
const LEAVE_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/LEAVE_COMMUNITY";
const DELETE_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/DELETE_COMMUNITY";
const GET_COMMUNITY_POSTS =
  "CITZ-HYBRIDWORKPLACE/COMMUNITY/GET_COMMUNITY_POSTS";

const noTokenText = "Trying to access accessToken, no accessToken in store";

const getUserTag = (post, userId) => {
  try {
    return post.tags.find((tag) => tag.taggedBy.find((user) => user === userId))
      ?.tag;
  } catch (err) {
    console.error(err);
  }
};

export const getCommunity = (title) => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/community/${title}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    dispatch({
      type: GET_COMMUNITY,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const getCommunities = () => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get("/api/community", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    dispatch({
      type: SET_COMMUNITIES,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const getUsersCommunities = () => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/community?orderBy=lastJoined`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });
    dispatch({
      type: SET_USERS_COMMUNITIES,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const getCommunityPosts = (title) => async (dispatch, getState) => {
  let successful = true;

  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/post/community/${title}`, {
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
      type: GET_COMMUNITY_POSTS,
      payload: posts,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const createCommunity =
  (communityData) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;

      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.post(
        `/api/community`,
        {
          title: communityData.title,
          description: communityData.description,
          rules: communityData.rules,
          tags: communityData.tags,
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
        type: ADD_COMMUNITY,
        payload: response.data,
      });

      dispatch({
        type: JOIN_COMMUNITY,
        payload: response.data.title,
      });
    } catch (err) {
      console.error(err);
      successful = false;
    } finally {
      return successful;
    }
  };

export const joinCommunity = (communityName) => async (dispatch, getState) => {
  let successful = true;
  try {
    const appState = getState();
    const token = appState.auth.accessToken;

    if (!token) throw new Error(noTokenText);

    await hwp_axios.patch(
      `/api/community/members/join/${communityName}`,
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

    dispatch({
      type: JOIN_COMMUNITY,
      payload: communityName,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const leaveCommunity = (communityName) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.delete(
      `/api/community/members/leave/${communityName}`,
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
      type: LEAVE_COMMUNITY,
      payload: communityName,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const deleteCommunity =
  (communityName) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;
      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.delete(
        `api/community/${communityName}`,
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
        type: DELETE_COMMUNITY,
        payload: communityName,
      });
    } catch (err) {
      console.error(err);
      successful = false;
    } finally {
      return successful;
    }
  };

export const editCommunity = (newCommunity) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(
      `api/community/${newCommunity.oldTitle}`,
      newCommunity,
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
      type: EDIT_COMMUNITY,
      payload: newCommunity,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

const initialState = {
  usersCommunities: [], //users communities
  items: [], //communities
  item: {}, //single community
};

export function communityReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COMMUNITY_POSTS:
      return {
        ...state,
        item: { ...state.item, posts: action.payload },
      };
    case GET_COMMUNITY:
      return {
        ...state,
        item: { ...state.item, ...action.payload },
      };
    case EDIT_COMMUNITY:
      return {
        ...state,
        item: Object.assign(state.community, action.payload),
      };
    case SET_COMMUNITIES:
      return {
        ...state,
        items: action.payload,
      };
    case SET_USERS_COMMUNITIES:
      return {
        ...state,
        usersCommunities: action.payload,
      };
    case ADD_COMMUNITY:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case JOIN_COMMUNITY:
      const comm = state.items.find(
        (element) => element.title === action.payload
      );
      if (!comm) return state;
      return {
        ...state,
        usersCommunities: [comm, ...state.usersCommunities],
      };
    case LEAVE_COMMUNITY:
      return {
        ...state,
        usersCommunities: state.usersCommunities?.filter(
          (item, index) => item.title !== action.payload
        ),
      };
    case DELETE_COMMUNITY:
      return {
        ...state,
        usersCommunities: state.usersCommunities.filter(
          (item) => item.title !== action.payload
        ),
        items: state.items.filter((item) => item.title !== action.payload),
      };
    default:
      return state;
  }
}
