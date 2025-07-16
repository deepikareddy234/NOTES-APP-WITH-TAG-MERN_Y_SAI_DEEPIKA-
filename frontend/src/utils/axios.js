import axios from "axios";

const axiosInstance = axios.create({
  // ⚠️ If you ever move the backend URL, change ONE place only (env var is even better)
  baseURL: "https://mern-notes-backend-j79q.onrender.com",
  withCredentials: true,   // send / receive cookies for auth
});

export default axiosInstance;
