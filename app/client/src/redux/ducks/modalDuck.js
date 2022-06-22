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

/************************DELETE TYPES************************/
const OPEN_DELETE_POST_MODAL =
  "CITZ-HYBRIDWORKPLACE/DELETE/OPEN_DELETE_POST_MODAL";
const CLOSE_DELETE_POST_MODAL =
  "CITZ-HYBRIDWORKPLACE/DELETE/CLOSE_DELETE_POST_MODAL";

const OPEN_DELETE_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/DELETE/OPEN_DELETE_COMMUNITY_MODAL";
const CLOSE_DELETE_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/DELETE/CLOSE_DELETE_COMMUNITY_MODAL";

const OPEN_DELETE_COMMENT_MODAL =
  "CITZ-HYBRIDWORKPLACE/DELETE/OPEN_DELETE_COMMENT_MODAL";
const CLOSE_DELETE_COMMENT_MODAL =
  "CITZ-HYBRIDWORKPLACE/DELETE/CLOSE_DELETE_COMMENT_MODAL";

/************************FLAG TYPES************************/
const OPEN_FLAG_POST_MODAL = "CITZ-HYBRIDWORKPLACE/FLAG/OPEN_FLAG_POST_MODAL";
const CLOSE_FLAG_POST_MODAL = "CITZ-HYBRIDWORKPLACE/FLAG/CLOSE_FLAG_POST_MODAL";

const OPEN_FLAG_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/FLAG/OPEN_FLAG_COMMUNITY_MODAL";
const CLOSE_FLAG_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/FLAG/CLOSE_FLAG_COMMUNITY_MODAL";

const OPEN_FLAG_COMMENT_MODAL =
  "CITZ-HYBRIDWORKPLACE/FLAG/OPEN_FLAG_COMMENT_MODAL";
const CLOSE_FLAG_COMMENT_MODAL =
  "CITZ-HYBRIDWORKPLACE/FLAG/CLOSE_FLAG_COMMENT_MODAL";

/************************EDIT TYPES************************/
const OPEN_EDIT_POST_MODAL = "CITZ-HYBRIDWORKPLACE/FLAG/OPEN_EDIT_POST_MODAL";
const CLOSE_EDIT_POST_MODAL = "CITZ-HYBRIDWORKPLACE/FLAG/CLOSE_EDIT_POST_MODAL";
const OPEN_EDIT_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/FLAG/OPEN_EDIT_COMMUNITY_MODAL";
const CLOSE_EDIT_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/FLAG/CLOSE_EDIT_COMMUNITY_MODAL";

/*************************ADD TYPES*************************/

const OPEN_ADD_POST_MODAL = "CITZ-HYBRIDWORKPLACE/ADD/OPEN_ADD_POST_MODAL";
const CLOSE_ADD_POST_MODAL = "CITZ-HYBRIDWORKPLACE/ADD/CLOSE_ADD_POST_MODAL";

/*********************** DELETE ACTIONS***********************/
export const openDeletePostModal = (post) => (dispatch) => {
  dispatch({ type: OPEN_DELETE_POST_MODAL, payload: post });
};

export const closeDeletePostModal = () => (dispatch) => {
  dispatch({ type: CLOSE_DELETE_POST_MODAL });
};

export const openDeleteCommunityModal = (community) => (dispatch) => {
  dispatch({ type: OPEN_DELETE_COMMUNITY_MODAL, payload: community });
};

export const closeDeleteCommunityModal = () => (dispatch) => {
  dispatch({ type: CLOSE_DELETE_COMMUNITY_MODAL });
};

export const openDeleteCommentModal = (post) => (dispatch) => {
  dispatch({ type: OPEN_DELETE_COMMENT_MODAL, payload: post });
};

export const closeDeleteCommentModal = () => (dispatch) => {
  dispatch({ type: CLOSE_DELETE_COMMENT_MODAL });
};

/*********************** FLAG MODAL ACTIONS***********************/
export const openFlagPostModal = (post) => (dispatch) => {
  dispatch({ type: OPEN_FLAG_POST_MODAL, payload: post });
};

export const closeFlagPostModal = () => (dispatch) =>
  dispatch({ type: CLOSE_FLAG_POST_MODAL });

export const openFlagCommunityModal = (community) => (dispatch) => {
  dispatch({ type: OPEN_FLAG_COMMUNITY_MODAL, payload: community });
};

export const closeFlagCommunityModal = () => (dispatch) => {
  dispatch({ type: CLOSE_FLAG_COMMUNITY_MODAL });
};

export const openFlagCommentModal = (comment) => (dispatch) => {
  dispatch({ type: OPEN_FLAG_COMMENT_MODAL, payload: comment });
};

export const closeFlagCommentModal = () => (dispatch) => {
  dispatch({ type: CLOSE_FLAG_COMMENT_MODAL });
};
/*********************** EDIT MODAL ACTIONS***********************/
export const openEditPostModal = (post) => (dispatch) => {
  dispatch({ type: OPEN_EDIT_POST_MODAL, payload: post });
};

export const closeEditPostModal = () => (dispatch) =>
  dispatch({ type: CLOSE_EDIT_POST_MODAL });

export const openEditCommunityModal = (community) => (dispatch) => {
  dispatch({ type: OPEN_EDIT_COMMUNITY_MODAL, payload: community });
};

export const closeEditCommunityModal = () => (dispatch) =>
  dispatch({ type: CLOSE_EDIT_COMMUNITY_MODAL });

/*********************** ADD MODAL ACTIONS***********************/

export const openAddPostModal = () => (dispatch) => {
  dispatch({ type: OPEN_ADD_POST_MODAL });
};

export const closeAddPostModal = () => (dispatch) => {
  dispatch({ type: CLOSE_ADD_POST_MODAL });
};

/************************MODAL REDUCER************************/
const initialState = {
  //Delete State
  deletePost: { open: false, post: {} },
  deleteCommunity: { open: false, community: {} },
  deleteComment: { open: false, comment: {} },
  //Flag State
  flagPost: { open: false, post: {} },
  flagCommunity: { open: false, community: {} },
  flagComment: { open: false, comment: {} },
  //Edit State
  editPost: { open: false, post: {} },
  editCommunity: { open: false, community: {} },
  addPost: { open: false },
};

export function modalReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_ADD_POST_MODAL:
      return {
        ...state,
        addPost: { open: true },
      };
    case CLOSE_ADD_POST_MODAL:
      return {
        ...state,
        addPost: { open: false },
      };
    case OPEN_DELETE_POST_MODAL:
      return {
        ...state,
        deletePost: { open: true, post: action.payload },
      };

    case CLOSE_DELETE_POST_MODAL:
      return initialState;

    case OPEN_DELETE_COMMUNITY_MODAL:
      return {
        ...state,
        deleteCommunity: { open: true, community: action.payload },
      };

    case CLOSE_DELETE_COMMUNITY_MODAL:
      return initialState;

    case OPEN_DELETE_COMMENT_MODAL:
      return {
        ...state,
        deleteComment: { open: true, comment: action.payload },
      };

    case CLOSE_DELETE_COMMENT_MODAL:
      return initialState;

    //Flags
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

    case OPEN_FLAG_COMMENT_MODAL:
      return {
        ...state,
        flagComment: { open: true, comment: action.payload },
      };

    case CLOSE_FLAG_COMMENT_MODAL:
      return initialState;

    //Edits
    case OPEN_EDIT_POST_MODAL:
      return {
        ...state,
        editPost: { open: true, post: action.payload },
      };

    case CLOSE_EDIT_POST_MODAL:
      return initialState;

    case OPEN_EDIT_COMMUNITY_MODAL:
      return {
        ...state,
        editCommunity: { open: true, community: action.payload },
      };

    case CLOSE_EDIT_COMMUNITY_MODAL:
      return initialState;

    default:
      return state;
  }
}
