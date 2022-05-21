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

const GET_COMMUNITIES = "GET_COMMUNITIES";
const ADD_COMMUNITY = "ADD_COMMUNITY";

const apiURI =
  window._env_.API_REF === ""
    ? `${process.env.REACT_APP_API_REF}`
    : `${window._env_.API_REF}:${window._env_.API_PORT}`;

export const getCommunities = () => (dispatch) => {
  fetch(`${apiURI}/api/community`)
    .then((res) => res.json())
    .then((communities) =>
      dispatch({
        type: GET_COMMUNITIES,
        payload: communities,
      })
    );
};

export const createCommunity = (communityData) => (dispatch) => {
  fetch(`${apiURI}/api/community`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: communityData.title,
      description: communityData.description,
      creator: communityData.creator,
    }),
  })
    .then((res) => res.json())
    .then((community) =>
      dispatch({
        type: ADD_COMMUNITY,
        payload: community,
      })
    );
};

const initialState = {
  items: [], //communitys
  item: {}, //single community
};

export function communityReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COMMUNITIES:
      return {
        ...state,
        items: action.payload,
      };
    case ADD_COMMUNITY:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    default:
      return state;
  }
}
