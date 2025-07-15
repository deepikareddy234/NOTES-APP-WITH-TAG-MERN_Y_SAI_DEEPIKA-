import axios from "./axios"; // your axios instance file
import { store, persistor } from "../redux/store"; // import both store and persistor
import { signOut } from "../redux/user/userSlice";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Dispatch signOut action to clear redux state
      store.dispatch(signOut());

      // Purge redux-persist cache
      await persistor.purge();

      // Remove user info from localStorage
      localStorage.removeItem("userInfo");

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
