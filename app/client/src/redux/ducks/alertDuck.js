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

const SET_ERROR = "CITZ-HYBRIDWORKPLACE/ALERT/SET_ERROR";
const SET_WARNING = "CITZ-HYBRIDWORKPLACE/ALERT/SET_WARNING";
const SET_SUCCESS = "CITZ-HYBRIDWORKPLACE/ALERT/SET_SUCCESS";

const REMOVE_ERROR = "CITZ-HYBRIDWORKPLACE/ALERT/REMOVE_ERROR";
const REMOVE_WARNING = "CITZ-HYBRIDWORKPLACE/ALERT/REMOVE_WARNING";
const REMOVE_SUCCESS = "CITZ-HYBRIDWORKPLACE/ALERT/REMOVE_SUCCESS";

export const createError = (errorText) => (dispatch) => {
  dispatch({
    type: SET_ERROR,
    payload: errorText,
  });
  setTimeout(() => {
    dispatch({
      type: REMOVE_ERROR,
    });
  }, 10000);
};

export const createWarning = (errorText) => (dispatch) => {
  dispatch({
    type: SET_WARNING,
    payload: errorText,
  });

  setTimeout(() => {
    dispatch({
      type: REMOVE_WARNING,
    });
  }, 2000);
};

export const createSuccess = (errorText) => (dispatch) => {
  dispatch({
    type: SET_SUCCESS,
    payload: errorText,
  });
  setTimeout(() => {
    dispatch({
      type: REMOVE_SUCCESS,
    });
  }, 2000);
};

const initialState = {
  errors: [],
  warnings: [],
  successes: [],
};

export function alertReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };
    case SET_WARNING:
      return {
        ...state,
        warnings: [...state.warnings, action.payload],
      };
    case SET_SUCCESS:
      return {
        ...state,
        successes: [...state.successes, action.payload],
      };
    case REMOVE_ERROR:
      const tempErrors = state.errors;
      tempErrors.shift();
      return {
        ...state,
        errors: [...tempErrors],
      };
    case REMOVE_WARNING:
      let tempWarnings = state.warnings;
      tempWarnings.shift();
      return {
        ...state,
        warnings: [...tempWarnings],
      };
    case REMOVE_SUCCESS:
      const tempSuccesses = state.successes;
      tempSuccesses.shift();
      return {
        ...state,
        successes: [...tempSuccesses],
      };
    default:
      return state;
  }
}
