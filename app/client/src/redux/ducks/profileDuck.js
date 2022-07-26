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
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @module

 */
import { createError } from "./alertDuck";
import hwp_axios from "../../axiosInstance";

const SET_USER = "CITZ-HYBRIDWORKPLACE/PROFILE/SET_USER";
const EDIT_USER_INFO = "CITZ-HYBRIDWORKPLACE/PROFILE/EDIT_USER_INFO";
const EDIT_USER_BIO = "CITZ-HYBRIDWORKPLACE/PROFILE/EDIT_USER_BIO";
const EDIT_USER_AVATAR = "CITZ-HYBRIDWORKPLACE/PROFILE/EDIT_USER_AVATAR";
const EDIT_USER_INTERESTS = "CITZ-HYBRIDWORKPLACE/PROFILE/EDIT_USER_INTERESTS";
const EDIT_USER_SETTINGS = "CITZ-HYBRIDWORKPLACE/PROFILE/EDIT_USER_SETTINGS";

const noTokenText = "Trying to access accessToken, no accessToken in store";

export const getProfile = (username) => async (dispatch, getState) => {
  let successful = true;
  try {
    const token = getState().auth.accessToken;
    if (!token) throw new Error(noTokenText);

    let response = await hwp_axios.get(`/api/user/${username}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });

    dispatch({
      type: SET_USER,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const editUserInfo = (userChanges) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(
      `/api/user`,
      {
        ...userChanges,
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
      type: EDIT_USER_INFO,
      payload: userChanges,
    });
  } catch (err) {
    console.error(err);
    successful = false;
    createError("Unexpected error occurred")(dispatch);
  } finally {
    return successful;
  }
};

export const editUserBio = (userChanges) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(
      `/api/user`,
      { ...userChanges },
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
      type: EDIT_USER_BIO,
      payload: userChanges,
    });
  } catch (err) {
    console.error(err);
    successful = false;
    createError("Unexpected error occurred")(dispatch);
  } finally {
    return successful;
  }
};

export const editUserAvatar = (userChanges) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(`/api/user`, userChanges, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        dispatch,
      },
    });
    dispatch({
      type: EDIT_USER_AVATAR,
      payload: userChanges,
    });
  } catch (err) {
    console.error(err);
    successful = false;
    createError("Unexpected error occurred")(dispatch);
  } finally {
    return successful;
  }
};

export const editUserInterests =
  (userChanges) => async (dispatch, getState) => {
    let successful = true;
    try {
      const authState = getState().auth;
      const token = authState.accessToken;

      if (!token) throw new Error(noTokenText);

      const response = await hwp_axios.patch(
        `/api/user`,
        {
          ...userChanges,
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
        type: EDIT_USER_INTERESTS,
        payload: userChanges,
      });
    } catch (err) {
      console.error(err);
      successful = false;
      createError("Unexpected error occurred")(dispatch);
    } finally {
      return successful;
    }
  };

export const editUserSettings = (userChanges) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(
      `/api/user`,
      {
        ...userChanges,
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
      type: EDIT_USER_SETTINGS,
      payload: userChanges,
    });
  } catch (err) {
    console.error(err);
    successful = false;
    createError("Unexpected error occurred")(dispatch);
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
    case EDIT_USER_INFO:
      return {
        user: {
          ...state.user,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          title: action.payload.title,
          ministry: action.payload.ministry,
        },
      };
    case EDIT_USER_BIO:
      return {
        user: {
          ...state.user,
          bio: action.payload.bio,
        },
      };
    case EDIT_USER_AVATAR:
      return {
        user: {
          ...state.user,
          avatar: action.payload.avatar,
        },
      };
    case EDIT_USER_INTERESTS:
      return {
        user: {
          ...state.user,
          interests: action.payload.interests,
        },
      };
    case EDIT_USER_SETTINGS:
      return {
        user: {
          ...state.user,
          notificationFrequency: action.payload.notificationFrequency,
          darkMode: action.payload.darkMode,
        },
      };
    default:
      return state;
  }
}
