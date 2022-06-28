import hwp_axios from "../axiosInstance";

export const isAPIHealthy = async () => {
  let successful = true;
  try {
    await hwp_axios.get("/api/health");
  } catch (e) {
    console.error(e);
    successful = false;
  } finally {
    return successful;
  }
};
