import axios from "../axios";
import { persistor } from "../redux/store";

// Intercept responses globally
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Clear Redux-persist state
      await persistor.purge();

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
