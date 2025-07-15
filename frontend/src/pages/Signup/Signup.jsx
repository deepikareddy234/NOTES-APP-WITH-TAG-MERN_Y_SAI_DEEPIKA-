import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axios from "../../axios"; // ✅ using custom axios
import { toast } from "react-toastify";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username) return setError("Please enter your username");
    if (!validateEmail(email)) return setError("Enter a valid email address");
    if (!password) return setError("Please enter a password");

    try {
      setError("");
      const res = await axios.post("/api/auth/signup", {
        username,
        email,
        password,
      });

      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setError(errMsg);
      toast.error(errMsg);
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
            Take control of your day with beautiful notes. Quick Note helps you capture ideas, organize tasks, and stay focused!
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

        {/* Signup Form */}
        <div className="md:w-1/2 px-8 py-12 bg-white">
          <form onSubmit={handleSignUp} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

            <input
              type="text"
              placeholder="Username"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
            >
              SIGN UP
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 underline font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
