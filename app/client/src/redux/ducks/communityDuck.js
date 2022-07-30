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
import {
  reshapeCommunitiesForFrontend,
  reshapeCommunityForFrontend,
} from "../../helperFunctions/communityHelpers";

import { createError } from "./alertDuck";
import { GET_POSTS } from "./postDuck";

const SET_COMMUNITIES = "CITZ-HYBRIDWORKPLACE/COMMUNITY/SET_COMMUNITIES";
const GET_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/GET_COMMUNITY";
const EDIT_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/EDIT_COMMUNITY";
const SET_USERS_COMMUNITIES =
  "CITZ-HYBRIDWORKPLACE/COMMUNITY/SET_USERS_COMMUNITIES";
const ADD_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/ADD_COMMUNITY";
const JOIN_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/JOIN_COMMUNITY";
const LEAVE_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/LEAVE_COMMUNITY";
const DELETE_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/DELETE_COMMUNITY";
const GET_COMMUNITY_POSTS =
  "CITZ-HYBRIDWORKPLACE/COMMUNITY/GET_COMMUNITY_POSTS";
const EDIT_COMMUNITY_MODERATOR_PERMISSIONS =
  "CITZ-HYBRIDWORKPLACE/COMMUNITY/EDIT_COMMUNITY_MODERATOR_PERMISSIONS";
const GET_COMMUNITY_MEMBERS =
  "CITZ-HYBRIDWORKPLACE/COMMUNITY/GET_COMMUNITY_MEMBERS";
const PROMOTE_USER = "CITZ-HYBRIDWORKPLACE/COMMUNITY/PROMOTE_USER";
const DEMOTE_USER = "CITZ-HYBRIDWORKPLACE/COMMUNITY/DEMOTE_USER";
const KICK_COMMUNITY_MEMBER =
  "CITZ-HYBRIDWORKPLACE/COMMUNITY/KICK_COMMUNITY_MEMBER";

const noTokenText = "Trying to access accessToken, no accessToken in store";

const getUserTag = (post, userId) => {
  try {
    return post.tags.find((tag) => tag.taggedBy.find((user) => user === userId))
      ?.tag;
  } catch (err) {
    createError(err.response.data);
    console.error(err);
  }
};

export const getCommunity = (title) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/community/${title}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });
    response.data = reshapeCommunityForFrontend(
      authState.user.id,
      response.data
    );
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
    const authState = getState().auth;
    const token = authState.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get("/api/community", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });
    response.data = reshapeCommunitiesForFrontend(
      authState.user.id,
      response.data
    );

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
    const authState = getState().auth;
    const token = authState.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/community?orderBy=engagement`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });
    response.data = reshapeCommunitiesForFrontend(
      authState.user.id,
      response.data
    );
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

export const getCommunityMembers = (title) => async (dispatch, getState) => {
  let successful = true;

  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/community/members/${title}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });
    dispatch({
      type: GET_COMMUNITY_MEMBERS,
      payload: { members: response.data, title },
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
        { ...communityData },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: {
            dispatch,
          },
        }
      );

      response.data = reshapeCommunityForFrontend(
        authState.user.id,
        response.data
      );

      dispatch({
        type: ADD_COMMUNITY,
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
    createError(err.response.data)(dispatch);
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
    createError(err.response.data)(dispatch);
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
      createError(err.response.data)(dispatch);
    } finally {
      return successful;
    }
  };

export const editCommunity =
  (commName, changes) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;
      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.patch(
        `api/community/${commName}`,
        { ...changes },
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
        payload: changes,
      });
    } catch (err) {
      console.error(err);
      successful = false;
      createError(err.response.data)(dispatch);
    } finally {
      return successful;
    }
  };

export const editCommunityModeratorPermissions =
  (moderator) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;
      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.patch(
        `/api/community/moderators/permissions/${moderator.community}`,
        {
          ...moderator,
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
        type: EDIT_COMMUNITY_MODERATOR_PERMISSIONS,
        payload: moderator,
      });
    } catch (err) {
      console.error(err);
      createError(err.response.data)(dispatch);
      successful = false;
    } finally {
      return successful;
    }
  };

export const promoteUser = (user) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(
      `/api/community/moderators/add/${user.community}`,
      {
        username: user.username,
        permissions: user.permissions,
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
      type: PROMOTE_USER,
      payload: user,
    });
  } catch (err) {
    console.error(err);
    createError(err.response.data)(dispatch);
    successful = false;
  } finally {
    return successful;
  }
};

export const demoteUser =
  (user, communityTitle) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;
      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.delete(
        `/api/community/moderators/remove/${communityTitle}`,
        {
          data: {
            username: user,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: {
            dispatch,
          },
        }
      );

      dispatch({
        type: DEMOTE_USER,
        payload: { communityTitle, user },
      });
    } catch (err) {
      console.error(err);
      createError(err.response.data)(dispatch);
      successful = false;
    } finally {
      return successful;
    }
  };

export const kickCommunityMember =
  (user, time) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;
      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.post(
        `/api/community/moderators/kick/${user.community}`,
        {
          username: user.username,
          period: time,
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
        type: KICK_COMMUNITY_MEMBER,
        payload: { user, time },
      });
    } catch (err) {
      console.error(err);
      createError(err.response.data)(dispatch);
      successful = false;
    } finally {
      return successful;
    }
  };

const initialState = {
  currentCommunityIndex: -1,
  communities: [],
};

export function communityReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COMMUNITY_POSTS:
      return {
        ...state,
        currentCommunity: { ...state.currentCommunity, posts: action.payload },
      };
    case GET_COMMUNITY:
      return (() => {
        const newState = { ...state };
        const commIndex = newState.communities.findIndex(
          (comm) => comm._id === action.payload._id
        );
        if (commIndex !== -1) {
          newState.communities[commIndex] = action.payload;
          newState.currentCommunityIndex = commIndex;
        } else {
          newState.communities.unshift(action.payload);
          newState.currentCommunityIndex = 0;
        }
        return newState;
      })();
    case EDIT_COMMUNITY:
      return (() => {
        const newState = { ...state };
        //Assigning currentCommunity to be a reference of the community object in the array
        const commIndex = newState.communities.findIndex(
          (comm) => comm.title === action.payload.oldTitle
        );
        //Making changes to currentCommunity
        newState.communities[commIndex].title =
          action.payload.title ?? newState.communities[commIndex].title;
        newState.communities[commIndex].description =
          action.payload.description ??
          newState.communities[commIndex].description;
        newState.communities[commIndex].rules =
          action.payload.rules ?? newState.communities[commIndex].rules;

        return newState;
      })();
    case SET_COMMUNITIES:
      return {
        ...state,
        communities: action.payload,
      };
    case SET_USERS_COMMUNITIES:
      return (() => {
        const newState = { ...state };
        // Merging Array of UsersCommunities and Communities already in the store
        newState.communities = [
          ...newState.communities,
          ...action.payload.filter(
            (comm) =>
              !newState.communities.find(
                (stateComm) => stateComm._id === comm._id
              )
          ),
        ];
        return newState;
      })();
    case ADD_COMMUNITY:
      return {
        ...state,
        communities: [action.payload, ...state.communities],
      };
    case JOIN_COMMUNITY:
      const comm = state.communities.find(
        (element) => element.title === action.payload
      );
      if (!comm) return state;
      return {
        ...state,
        communities: state.communities.map((e) => {
          return e._id === comm._id
            ? { ...e, memberCount: e.memberCount + 1, userIsInCommunity: true }
            : e;
        }),
      };
    case LEAVE_COMMUNITY:
      return {
        ...state,
        communities: state.communities.map((e) => {
          return e.title === action.payload
            ? { ...e, memberCount: e.memberCount - 1, userIsInCommunity: false }
            : e;
        }),
      };
    case DELETE_COMMUNITY:
      return {
        ...state,
        communities: state.communities.filter(
          (item) => item.title !== action.payload
        ),
      };
    case EDIT_COMMUNITY_MODERATOR_PERMISSIONS:
      return (() => {
        const newState = { ...state };
        //Assigning currentCommunity to be a reference of the community object in the array
        const commIndex = newState.communities.findIndex(
          (comm) => comm.title === action.payload.community
        );
        const modIndex = newState.communities[commIndex].moderators.findIndex(
          (mod) => mod.username === action.payload.username
        );
        newState.communities[commIndex].moderators[modIndex].permissions =
          action.payload.permissions ??
          newState.communities[commIndex].moderators[modIndex].permissions;

        return newState;
      })();
    case GET_COMMUNITY_MEMBERS:
      return {
        ...state,
        communities: state.communities.map((comm) =>
          comm.title === action.payload.title
            ? {
                ...comm,
                membersList: action.payload.members,
                memberCount: action.payload.members.length,
              }
            : comm
        ),
      };

    case PROMOTE_USER:
      return {
        ...state,
        communities: state.communities.map((comm) =>
          comm.title === action.payload.community
            ? {
                ...comm,
                moderators: [
                  ...comm.moderators,
                  {
                    name: action.payload.username,
                    username: action.payload.username,
                    permissions: action.payload.permissions,
                  },
                ],
              }
            : comm
        ),
      };
    case DEMOTE_USER:
      return {
        ...state,
        communities: state.communities.map((comm) =>
          comm.title === action.payload.communityTitle
            ? {
                ...comm,
                moderators: comm.moderators.filter(
                  (mod) => mod.name !== action.payload.user
                ),
              }
            : comm
        ),
      };
    case KICK_COMMUNITY_MEMBER:
      return {
        ...state,
        communities: state.communities.map((comm) => {
          return comm.title === action.payload.communityTItle
            ? {
                ...comm,
                members: comm.members.filter(
                  (member) => member.name !== action.payload.user
                ),
                memberCount: comm.memberCount - 1,
              }
            : comm;
        }),
      };
    default:
      return state;
  }
}
