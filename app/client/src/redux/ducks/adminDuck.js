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

const SET_ADMIN_DATA = "CITZ-HYBRIDWORKPLACE/ADMIN/SET_ADMIN_DATA";
const CLEAR_ADMIN_DATA = "CITZ-HYBRIDWORKPLACE/ADMIN/CLEAR_ADMIN_DATA";
const ADMIN_DELETE_USER = "CITZ-HYBRIDWORKPLACE/ADMIN/ADMIN_DELETE_USER";
const ADMIN_EDIT_USER = "CITZ-HYBRIDWORKPLACE/ADMIN/ADMIN_EDIT_USER";

const noTokenText = "Trying to access accessToken, no accessToken in store";

export const getAdminData = () => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.get(`/api/admin`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    dispatch({
      type: SET_ADMIN_DATA,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const adminDeleteUser = (username) => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.delete(`/api/user/${username}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    dispatch({
      type: ADMIN_DELETE_USER,
      payload: username,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const adminEditUser =
  (username, changes) => async (dispatch, getState) => {
    let successful = true;
    try {
      const token = getState().auth.accessToken;
      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.patch(
        `/api/user?username=${username}`,
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
        type: ADMIN_EDIT_USER,
        payload: changes,
      });
    } catch (err) {
      console.error(err);
      successful = false;
    } finally {
      return successful;
    }
  };

const initialState = {
  status: { communities: {}, posts: {}, comments: {} },
  users: { columns: [], rows: [] },
  posts: { columns: [], rows: [] },
  communities: { columns: [], rows: [] },
  comments: { columns: [], rows: [] },
};

export function adminReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ADMIN_DATA:
      return action.payload;
    case CLEAR_ADMIN_DATA:
      return initialState;
    case ADMIN_DELETE_USER:
      //TODO
      return state;
    case ADMIN_EDIT_USER:
      //TODO
      return state;
    default:
      return state;
  }
}
