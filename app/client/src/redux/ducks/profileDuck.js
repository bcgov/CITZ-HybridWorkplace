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

const SET_USER = "CITZ-HYBRIDWORKPLACE/COMMUNITY/SET_USER";

const noTokenText = "Trying to access accessToken, no accessToken in store";

const apiURI = !window._env_.REACT_APP_LOCAL_DEV
  ? `${window._env_.REACT_APP_API_REF}`
  : `http://${window._env_.REACT_APP_API_REF}:${window._env_.REACT_APP_API_PORT}`;

export const getProfile = (name) => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await fetch(`${apiURI}/api/profile`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const user = await response.json();

    dispatch({
      type: SET_USER,
      payload: user,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

const initialState = {
  user: {}, //single profile
};

export function profileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.payload,
      };
    default:
      return state;
  }
}
