import axios from "axios";
import jwtDecode from "jwt-decode";

import { SET_ACCESS_TOKEN } from "./redux/ducks/authDuck";
window._env_ = {
  REACT_APP_API_PORT: 5000,
  REACT_APP_API_REF: "localhost",
  REACT_APP_LOCAL_DEV: true,
};

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

hwp_axios.interceptors.request.use(
  async (config) => {
    if (!config.headers.authorization || !config.dispatch) {
      return config;
    }
     
    const token = config.headers.authorization.split(" ")[1];
    const { exp } = jwtDecode(token);

    if (exp < new Date().getTime() / 1000) {
    try {
        const res = await fetch(`${apiURI}/api/token`, {
          credentials: "include",
        });
        const data = await res.json();

        config.headers.authorization = `Bearer ${data.token}`;
        config.dispatch({ type: SET_ACCESS_TOKEN, payload: data });
        delete config.dispatch;
      }
    } catch (err) {
      console.error(err);
    } finally {
      return config;
    }
  },
  (error) => {
    console.error("Unexpected Axios Error");
  }
);

export default hwp_axios;
