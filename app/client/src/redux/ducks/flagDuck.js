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

const OPEN_FLAG_POST_MODAL = "CITZ-HYBRIDWORKPLACE/FLAG/OPEN_FLAG_POST_MODAL";
const CLOSE_FLAG_POST_MODAL = "CITZ-HYBRIDWORKPLACE/FLAG/CLOSE_FLAG_POST_MODAL";
const OPEN_FLAG_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/FLAG/OPEN_FLAG_COMMUNITY_MODAL";
const CLOSE_FLAG_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/FLAG/CLOSE_FLAG_COMMUNITY_MODAL";

const noTokenText = "Trying to access accessToken, no accessToken in store";

const apiURI = !window._env_.REACT_APP_LOCAL_DEV
  ? `${window._env_.REACT_APP_API_REF}`
  : `http://${window._env_.REACT_APP_API_REF}:${window._env_.REACT_APP_API_PORT}`;

export const openFlagPostModal = (post) => (dispatch) => {
  //Closing the flag community modal as a safeguard to prevent confusing application state
  closeFlagCommunityModal()(dispatch);
  dispatch({ type: OPEN_FLAG_POST_MODAL, payload: post });
};

export const closeFlagPostModal = () => (dispatch) =>
  dispatch({ type: CLOSE_FLAG_POST_MODAL });

export const openFlagCommunityModal = (community) => (dispatch) => {
  //Closing the flag post modal as a safeguard to prevent confusing application state
  closeFlagPostModal()(dispatch);
  dispatch({ type: OPEN_FLAG_COMMUNITY_MODAL, payload: community });
};

export const closeFlagCommunityModal = () => (dispatch) =>
  dispatch({ type: OPEN_FLAG_COMMUNITY_MODAL });

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

const initialState = {
  flagPost: { open: false, post: {} }, //communitys
  flagCommunity: { open: false, community: {} }, //single community
};

export function flagReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_FLAG_POST_MODAL:
      return {
        ...state,
        flagPost: { open: true, post: action.payload },
      };
    case CLOSE_FLAG_POST_MODAL:
      return initialState;
    case OPEN_FLAG_COMMUNITY_MODAL:
      return {
        ...state,
        flagCommunity: { open: true, community: action.payload },
      };
    case CLOSE_FLAG_COMMUNITY_MODAL:
      return initialState;
    default:
      return state;
  }
}
