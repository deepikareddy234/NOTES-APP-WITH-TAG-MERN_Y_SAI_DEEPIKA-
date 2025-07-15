import axios from "../axios";
import { persistor } from "../redux/store";

axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      await persistor.purge(); // ✅ clear Redux-persist state
      window.location.href = "/login"; // ✅ redirect to login
    }
    return Promise.reject(err);
  }
);
