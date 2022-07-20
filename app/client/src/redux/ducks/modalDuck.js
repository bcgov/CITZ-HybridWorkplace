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
const OPEN_EDIT_POST_MODAL = "CITZ-HYBRIDWORKPLACE/EDIT/OPEN_EDIT_POST_MODAL";
const CLOSE_EDIT_POST_MODAL = "CITZ-HYBRIDWORKPLACE/EDIT/CLOSE_EDIT_POST_MODAL";
const OPEN_EDIT_USER_INFO_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/OPEN_EDIT_USER_INFO_MODAL";
const CLOSE_EDIT_USER_INFO_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/CLOSE_EDIT_USER_INFO_MODAL";
const OPEN_EDIT_USER_BIO_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/OPEN_EDIT_USER_BIO_MODAL";
const CLOSE_EDIT_USER_BIO_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/CLOSE_EDIT_USER_BIO_MODAL";
const OPEN_EDIT_USER_INTERESTS_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/OPEN_EDIT_USER_INTERESTS_MODAL";
const CLOSE_EDIT_USER_INTERESTS_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/CLOSE_EDIT_USER_INTERESTS_MODAL";
const OPEN_EDIT_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/OPEN_EDIT_COMMUNITY_MODAL";
const CLOSE_EDIT_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/CLOSE_EDIT_COMMUNITY_MODAL";
const OPEN_SETTINGS_MODAL = "CITZ-HYBRIDWORKPLACE/EDIT/OPEN_SETTINGS_MODAL";
const CLOSE_SETTINGS_MODAL = "CITZ-HYBRIDWORKPLACE/EDIT/CLOSE_SETTINGS_MODAL";
const OPEN_EDIT_AVATAR_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/OPEN_EDIT_AVATAR_MODAL";
const CLOSE_EDIT_AVATAR_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/CLOSE_EDIT_AVATAR_MODAL";
const OPEN_EDIT_MODERATOR_PERMISSIONS_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/OPEN_EDIT_MODERATOR_PERMISSIONS_MODAL";
const CLOSE_EDIT_MODERATOR_PERMISSIONS_MODAL =
  "CITZ-HYBRIDWORKPLACE/EDIT/CLOSE_EDIT_MODERATOR_PERMISSIONS_MODAL";

/*************************ADD TYPES*************************/
const OPEN_ADD_POST_MODAL = "CITZ-HYBRIDWORKPLACE/ADD/OPEN_ADD_POST_MODAL";
const OPEN_ADD_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/ADD/OPEN_ADD_COMMUNITY_MODAL";
const CLOSE_ADD_POST_MODAL = "CITZ-HYBRIDWORKPLACE/ADD/CLOSE_ADD_POST_MODAL";
const CLOSE_ADD_COMMUNITY_MODAL =
  "CITZ-HYBRIDWORKPLACE/ADD/CLOSE_ADD_COMMUNITY_MODAL";

/**********************MODERATOR TYPES**********************/
const OPEN_DEMOTE_USER_MODAL =
  "CITZ-HYBRIDWORKPLACE/MODERATOR/OPEN_ADD_POST_MODAL";
const CLOSE_DEMOTE_USER_MODAL =
  "CITZ-HYBRIDWORKPLACE/MODERATOR/CLOSE_ADD_POST_MODAL";
const OPEN_PROMOTE_USER_MODAL =
  "CITZ-HYBRIDWORKPLACE/MODERATOR/OPEN_PROMOTE_USER_MODAL";
const CLOSE_PROMOTE_USER_MODAL =
  "CITZ-HYBRIDWORKPLACE/MODERATOR/CLOSE_PROMOTE_USER_MODAL";

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

export const openEditUserInfoModal = (userInfo) => (dispatch) => {
  dispatch({ type: OPEN_EDIT_USER_INFO_MODAL, payload: userInfo });
};

export const closeEditUserInfoModal = () => (dispatch) =>
  dispatch({ type: CLOSE_EDIT_USER_INFO_MODAL });

export const openEditUserBioModal = (userBio) => (dispatch) => {
  dispatch({ type: OPEN_EDIT_USER_BIO_MODAL, payload: userBio });
};

export const closeEditUserBioModal = () => (dispatch) =>
  dispatch({ type: CLOSE_EDIT_USER_BIO_MODAL });

export const openEditUserInterestsModal = (interests) => (dispatch) => {
  dispatch({ type: OPEN_EDIT_USER_INTERESTS_MODAL, payload: interests });
};

export const closeEditUserInterestsModal = () => (dispatch) =>
  dispatch({ type: CLOSE_EDIT_USER_INTERESTS_MODAL });

export const openEditCommunityModal = (community) => (dispatch) => {
  dispatch({ type: OPEN_EDIT_COMMUNITY_MODAL, payload: community });
};

export const closeEditCommunityModal = () => (dispatch) =>
  dispatch({ type: CLOSE_EDIT_COMMUNITY_MODAL });

export const openSettingsModal = (userSettings) => (dispatch) =>
  dispatch({ type: OPEN_SETTINGS_MODAL, payload: userSettings });

export const closeSettingsModal = () => (dispatch) =>
  dispatch({ type: CLOSE_SETTINGS_MODAL });

export const openEditAvatarModal = (avatar) => (dispatch) => {
  dispatch({ type: OPEN_EDIT_AVATAR_MODAL, payload: avatar });
};

export const closeEditAvatarModal = () => (dispatch) =>
  dispatch({ type: CLOSE_EDIT_AVATAR_MODAL });

export const openEditModeratorPermissionsModal = (moderator) => (dispatch) => {
  dispatch({
    type: OPEN_EDIT_MODERATOR_PERMISSIONS_MODAL,
    payload: moderator,
  });
};

export const closeEditModeratorPermissionsModal = () => (dispatch) =>
  dispatch({ type: CLOSE_EDIT_MODERATOR_PERMISSIONS_MODAL });

/*********************** ADD MODAL ACTIONS***********************/

export const openAddPostModal = () => (dispatch) => {
  dispatch({ type: OPEN_ADD_POST_MODAL });
};

export const closeAddPostModal = () => (dispatch) => {
  dispatch({ type: CLOSE_ADD_POST_MODAL });
};

export const openAddCommunityModal = () => (dispatch) => {
  dispatch({ type: OPEN_ADD_COMMUNITY_MODAL });
};

export const closeAddCommunityModal = () => (dispatch) => {
  dispatch({ type: CLOSE_ADD_COMMUNITY_MODAL });
};

/*********************** ADD MODAL ACTIONS***********************/

export const openDemoteUserModal = (username) => (dispatch) => {
  dispatch({ type: OPEN_DEMOTE_USER_MODAL, payload: username });
};

export const closeDemoteUserModal = () => (dispatch) => {
  dispatch({ type: CLOSE_DEMOTE_USER_MODAL });
};

export const openPromoteUserModal = () => (dispatch) => {
  dispatch({ type: OPEN_PROMOTE_USER_MODAL });
};

export const closePromoteUserModal = () => (dispatch) => {
  dispatch({ type: CLOSE_PROMOTE_USER_MODAL });
};

/************************MODAL REDUCER************************/
const initialState = {
  // Delete State
  deletePost: { open: false, post: {} },
  deleteCommunity: { open: false, community: {} },
  deleteComment: { open: false, comment: {} },
  // Flag State
  flagPost: { open: false, post: {} },
  flagCommunity: { open: false, community: {} },
  flagComment: { open: false, comment: {} },
  // Edit State
  editPost: { open: false, post: {} },
  editCommunity: { open: false, community: {} },
  editUserInfo: { open: false, userInfo: {} },
  editUserBio: { open: false, userBio: "" },
  editAvatar: { open: false, avatar: {} },
  editUserInterests: { open: false, interests: {} },
  editSettings: { open: false, userSettings: {} },
  editModPermissions: { open: false, moderator: {} },
  // Add State
  addPost: { open: false },
  addCommunity: { open: false },
  // Moderator State
  demoteUser: { open: false, username: "" },
  promoteUser: { open: false },
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

    case OPEN_EDIT_USER_INFO_MODAL:
      return {
        ...state,
        editUserInfo: { open: true, userInfo: action.payload },
      };

    case CLOSE_EDIT_USER_INFO_MODAL:
      return initialState;

    case OPEN_EDIT_USER_BIO_MODAL:
      return {
        ...state,
        editUserBio: { open: true, userBio: action.payload },
      };

    case CLOSE_EDIT_USER_BIO_MODAL:
      return initialState;

    case OPEN_EDIT_USER_INTERESTS_MODAL:
      return {
        ...state,
        editUserInterests: { open: true, interests: action.payload },
      };

    case CLOSE_EDIT_USER_INTERESTS_MODAL:
      return initialState;

    case OPEN_EDIT_COMMUNITY_MODAL:
      return {
        ...state,
        editCommunity: { open: true, community: action.payload },
      };

    case OPEN_SETTINGS_MODAL:
      return {
        ...state,
        editSettings: { open: true, userSettings: action.payload },
      };

    case CLOSE_SETTINGS_MODAL:
      return initialState;

    case CLOSE_EDIT_AVATAR_MODAL:
      return initialState;

    case OPEN_EDIT_AVATAR_MODAL:
      return {
        ...state,
        editAvatar: { open: true, avatar: action.payload },
      };

    case OPEN_ADD_COMMUNITY_MODAL:
      return {
        ...state,
        addCommunity: { open: true },
      };

    case CLOSE_ADD_COMMUNITY_MODAL:
      return {
        ...state,
        addCommunity: { open: false },
      };

    case CLOSE_EDIT_COMMUNITY_MODAL:
      return initialState;

    case CLOSE_EDIT_MODERATOR_PERMISSIONS_MODAL:
      return initialState;

    case OPEN_EDIT_MODERATOR_PERMISSIONS_MODAL:
      return {
        ...state,
        editModPermissions: { open: true, moderator: action.payload },
      };

    // Moderators
    case OPEN_DEMOTE_USER_MODAL:
      return {
        ...state,
        demoteUser: { open: true, username: action.payload },
      };

    case CLOSE_DEMOTE_USER_MODAL:
      return initialState;

    case OPEN_PROMOTE_USER_MODAL:
      return {
        ...state,
        promoteUser: { open: true },
      };

    case CLOSE_PROMOTE_USER_MODAL:
      return initialState;

    default:
      return state;
  }
}
