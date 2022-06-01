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

const SET_COMMUNITIES = "CITZ-HYBRIDWORKPLACE/COMMUNITY/SET_COMMUNITIES";
const ADD_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/ADD_COMMUNITY";
const JOIN_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/JOIN_COMMUNITY";
const LEAVE_COMMUNITY = "CITZ-HYBRIDWORKPLACE/COMMUNITY/LEAVE_COMMUNITY";

const noTokenText = "Trying to access accessToken, no accessToken in store";

const apiURI = !window._env_.REACT_APP_LOCAL_DEV
  ? `${window._env_.REACT_APP_API_REF}`
  : `http://${window._env_.REACT_APP_API_REF}:${window._env_.REACT_APP_API_PORT}`;

export const getCommunities = () => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await fetch(`${apiURI}/api/community`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const communities = await response.json();

    dispatch({
      type: SET_COMMUNITIES,
      payload: communities,
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
      const name = authState.user.name;
      if (!token) throw new Error(noTokenText);

      const response = await fetch(`${apiURI}/api/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: communityData.title,
          description: communityData.description,
          rules: communityData.rules,
        }),
      });

      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);

      const community = await response.json();

      dispatch({
        type: ADD_COMMUNITY,
        payload: community,
      });

      dispatch({
        type: JOIN_COMMUNITY,
        payload: community.title,
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
    const authState = getState().auth;
    const token = authState.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await fetch(
      `${apiURI}/api/community/join/${communityName}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

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

    const response = await fetch(
      `${apiURI}/api/community/leave/${communityName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

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

const initialState = {
  items: [], //users communitys
  item: {}, //single community
};

export function communityReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COMMUNITIES:
      return {
        ...state,
        items: action.payload,
      };
    case ADD_COMMUNITY:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case JOIN_COMMUNITY:
      return {
        ...state,
        usersCommunities: [action.payload, ...state.usersCommunities],
      };
    case LEAVE_COMMUNITY:
      return {
        ...state,
        items: state.items?.filter(
          (item, index) => item.title !== action.payload
        ),
      };
    default:
      return state;
  }
}
