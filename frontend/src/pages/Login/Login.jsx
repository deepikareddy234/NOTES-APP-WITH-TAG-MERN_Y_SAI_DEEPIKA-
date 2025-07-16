// frontend/src/pages/Login/Login.jsx
import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import api from "../../utils/axios";       // shared Axios instance
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  const dispatch = useDispatch();
  const navigate  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple front‑end validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    try {
      dispatch(signInStart());

      // IMPORTANT: api.baseURL already ends with "/api",
      // so we do NOT prefix the route with /api here
      const res = await api.post("/auth/signin", { email, password });

      if (res.data.success === false) {
        toast.error(res.data.message);
        dispatch(signInFailure(res.data.message));
        return;
      }

      const user = res.data.user;
      localStorage.setItem("userInfo", JSON.stringify(user));

      dispatch(signInSuccess(user));
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      dispatch(signInFailure(msg));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-red-100 to-pink-200 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-orange-200">
        {/* Left Panel */}
        <div className="md:w-1/2 bg-orange-50 px-10 py-16 flex flex-col justify-center text-left space-y-5">
          <h1 className="text-4xl font-extrabold text-orange-600 flex items-center gap-3">
            📔 Quick Note
          </h1>
          <p className="text-md text-gray-700">
            Take control of your day with beautiful notes. Quick Note helps you capture ideas,
            organize tasks, and stay focused!
          </p>
          <ul className="text-sm text-gray-600 space-y-2 mt-4">
            <li>✅ Create, edit & delete notes</li>
            <li>🔍 Smart search functionality</li>
            <li>📱 Responsive & mobile-friendly</li>
            <li>🌍 Access from anywhere</li>
          </ul>
          <p className="text-xs italic text-gray-500 pt-6">
            "The shortest pencil is better than the longest memory."
          </p>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login to Your Account
          </h2>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-500 text-sm pt-1 pb-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 mt-4 rounded-lg font-medium transition duration-200"
            >
              LOGIN
            </button>

            <p className="text-sm text-center mt-6 text-gray-600">
              Not registered yet?{" "}
              <Link
                to="/signup"
                className="text-orange-600 font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
