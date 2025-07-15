import axios from "axios";

const instance = axios.create({
  baseURL: "https://mern-notes-backend-j79q.onrender.com",
  withCredentials: true,
});

export default instance;
