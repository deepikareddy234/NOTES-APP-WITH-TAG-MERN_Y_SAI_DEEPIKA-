import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout, userInfo }) => {
  const username = userInfo?.username || "User";

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold bg-orange-500 shadow">
        {getInitials(username)}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-900">{username}</p>
      </div>

      <button
        className="text-sm bg-red-500 p-1 rounded-md text-white hover:opacity-80"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileInfo;
