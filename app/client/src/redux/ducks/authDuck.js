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

import jwtDecode from "jwt-decode";

const SET_ACCESS_TOKEN = "CITZ-HYBRIDWORKPLACE/AUTH/SET_ACCESS_TOKEN";
const SET_REFRESH_TOKEN = "CITZ-HYBRIDWORKPLACE/AUTH/SET_REFRESH_TOKEN";
const LOGIN = "CITZ-HYBRIDWORKPLACE/AUTH/LOGIN";
const LOGOUT = "CITZ-HYBRIDWORKPLACE/AUTH/LOGOUT";

/* 
  If you're running a local dev server using npm run then
  this will provide the necessary environment variables to 
  the app.
*/
if (!window._env_) {
  window._env_ = {
    REACT_APP_API_PORT: 5000,
    REACT_APP_API_REF: "localhost",
    REACT_APP_LOCAL_DEV: true,
  };
}

const apiURI = !window._env_.REACT_APP_LOCAL_DEV
  ? `${window._env_.REACT_APP_API_REF}`
  : `http://${window._env_.REACT_APP_API_REF}:${window._env_.REACT_APP_API_PORT}`;

export const login = (username, password) => async (dispatch) => {
  let successful = true;
  try {
    const res = await fetch(`${apiURI}/api/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!res.ok) {
      throw new Error(res.status + " " + res.statusText);
    }

    const data = await res.json();
    const decodedToken = jwtDecode(data.token);
    data.user = decodedToken;
    dispatch({
      type: LOGIN,
      payload: data,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const register = (username, email, password) => async (dispatch) => {
  let successful = true;
  try {
    const res = await fetch(`${apiURI}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (!res.ok) throw new Error(res.status + " " + res.statusText);
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const logout = () => async (dispatch) => {
  let successful = true;
  try {
    const res = await fetch(`${apiURI}/api/logout`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(res.status + " " + res.statusText);

    dispatch({
      type: LOGOUT,
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

const initialState = {
  refreshToken: "",
  accessToken: "",
  user: {},
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload.token,
      };
    case SET_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: action.payload.refreshToken,
      };
    case LOGIN:
      return {
        accessToken: action.payload.token,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
