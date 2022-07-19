import hwp_axios from "../../axiosInstance";
import { EDIT_POST } from "./postDuck";

const noTokenText = "Trying to access accessToken, no accessToken in store";

export const hidePost = (postId) => async (dispatch, getState) => {
  let successful = true;
  try {
    const authState = getState().auth;
    const token = authState.accessToken;
    const changes = { hidden: true };

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.patch(
      `/api/post/${postId}`,
      {
        ...changes,
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
      type: EDIT_POST,
      payload: { id: postId, ...changes },
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

export const absolvePost = (postId, showPost) => async (dispatch, getState) => {
  let successful = true;
  console.log("helo");
  try {
    const authState = getState().auth;
    const token = authState.accessToken;
    const changes = { hidden: !showPost, flags: [] };

    if (!token) throw new Error(noTokenText);

    const response = await hwp_axios.delete(
      `/api/post/flags/resolve/${postId}?show=${showPost}`,
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
      type: EDIT_POST,
      payload: { id: postId, ...changes },
    });
  } catch (err) {
    console.error(err);
    successful = false;
  } finally {
    return successful;
  }
};

const initialState = {};

export function moderatorReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
