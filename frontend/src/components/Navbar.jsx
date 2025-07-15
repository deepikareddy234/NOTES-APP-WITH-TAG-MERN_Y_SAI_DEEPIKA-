import React, { useEffect, useState } from "react";
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
import axios from "axios";

const Navbar = ({ onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.currentUser);

 const handleInputChange = (e) => {
  const value = e.target.value;
  setSearchQuery(value);

  if (value.trim() === "") {
    // ✅ Force full refresh
    handleClearSearch();
    return;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const timer = setTimeout(() => {
    onSearchNote(value);
  }, 300);

  setDebounceTimer(timer);
};


  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogout = async () => {
    try {
      dispatch(signoutStart());
      const res = await axios.get("http://localhost:3000/api/auth/signout", {
        withCredentials: true,
      });

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      dispatch(signInSuccess(null));
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-400 to-yellow-300 flex items-center justify-between px-6 py-3 shadow-md">
      <Link to={"/"}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaStickyNote className="text-white text-3xl" />
          Quick Note
        </h2>
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={handleInputChange}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
