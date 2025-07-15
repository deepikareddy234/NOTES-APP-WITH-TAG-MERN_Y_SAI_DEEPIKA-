import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mern-notes-backend-j79q.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
