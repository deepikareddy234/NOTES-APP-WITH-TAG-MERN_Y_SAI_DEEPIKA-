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
import api from "../utils/axios";          // ← use api, not axios

const Navbar = ({ onSearchNote, handleClearSearch }) => {
  /* ...state hooks... */

  const onLogout = async () => {
    try {
      dispatch(signoutStart());
      // prefix with /api/auth
      const res = await api.get("/api/auth/signout");

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

  /* JSX remains unchanged */
};

export default Navbar;
