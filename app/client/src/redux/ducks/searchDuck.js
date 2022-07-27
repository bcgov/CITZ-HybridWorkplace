/* 
 Copyright Â© 2022 Province of British Columbia

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
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module

 */

import hwp_axios from "../../axiosInstance";

const SET_SEARCH = "CITZ-HYBRIDWORKPLACE/SEARCH/SET_USER";

const noTokenText = "Trying to access accessToken, no accessToken in store";

export const search = (query) => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/search/${query}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    dispatch({
      type: SET_SEARCH,
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
  posts: [],
  communities: [],
  users: [],
};

export function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH:
      return {
        posts: action.payload.posts,
        communities: action.payload.communities,
        users: action.payload.users,
      };
    default:
      return state;
  }
}
