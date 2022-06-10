import axios from "axios";
import jwtDecode from "jwt-decode";

import { SET_ACCESS_TOKEN } from "./redux/ducks/authDuck";

const apiURI = !window._env_.REACT_APP_LOCAL_DEV
  ? `${window._env_.REACT_APP_API_REF}`
  : `http://${window._env_.REACT_APP_API_REF}:${window._env_.REACT_APP_API_PORT}`;

const hwp_axios = axios.create({
  baseURL: apiURI,
  withCredentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @purpose checks if the given token is expired, and generates a new token if it is expired
 *
 * @notes In order for this function to update the redux store with the received token from the api,
 * all requests must pass in the redux "dispatch" function in the params object of the request.
 *
 * Although this is definitely not the optimal decision, this is a decision that works and will be
 * improved on in the future.
 */
hwp_axios.interceptors.request.use(
  async (config) => {
    //If the access token, or dispatch function aren't passed, return the default.
    if (!config.headers.authorization || !config.params.dispatch) {
      return config;
    }

    //Extract access token from request headers and get the expiry time.
    const token = config.headers.authorization.split(" ")[1];
    const { exp } = jwtDecode(token);

    try {
      /*
      1. Check if the token is expired
      2. If the token is expired, get a new token from the /token endpoint
      3. Replace the request's original token with the new token received from the API
      4. Delete the dispatch property before sending it to the API
      */
      if (exp < new Date().getTime() / 1000) {
        const res = await fetch(`${apiURI}/api/token`, {
          credentials: "include",
        });
        const data = await res.json();

        config.headers.authorization = `Bearer ${data.token}`;
        config.params.dispatch({ type: SET_ACCESS_TOKEN, payload: data });
        delete config.params.dispatch;
      }
    } catch (err) {
      console.error(err);
    } finally {
      return config;
    }
  },
  (error) => {
    console.error(error);
  }
);

export default hwp_axios;
