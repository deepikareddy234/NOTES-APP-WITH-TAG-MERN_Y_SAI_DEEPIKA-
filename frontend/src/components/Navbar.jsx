// frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import SearchBar from "./SearchBar/SearchBar";
import ProfileInfo from "./Cards/ProfileInfo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaStickyNote } from "react-icons/fa";
import {
  signInSuccess,
  signoutFailure,
  signoutStart,
} from "../redux/user/userSlice";
import api from "../utils/axios";   // central axios

const Navbar = ({ onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const userInfo  = useSelector((state) => state.user.currentUser);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val.trim()) {
      handleClearSearch();
      return;
    }

    clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(() => onSearchNote(val), 300));
  };

  const onLogout = async () => {
    try {
      dispatch(signoutStart());
      const res = await api.get("/auth/signout");
      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      dispatch(signInSuccess(null));
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
      dispatch(signoutFailure(err.message));
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-400 to-yellow-300 flex items-center justify-between px-6 py-3 shadow-md">
      <Link to="/">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaStickyNote className="text-3xl" />
          Quick Note
        </h2>
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={handleInputChange}
        handleSearch={() => searchQuery.trim() && onSearchNote(searchQuery)}
        onClearSearch={() => {
          setSearchQuery("");
          handleClearSearch();
        }}
        onKeyDown={(e) => e.key === "Enter" && onSearchNote(searchQuery)}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
