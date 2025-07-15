import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center px-5 rounded mb-3 border-[1.5px] border-gray-300 focus-within:ring-2 focus-within:ring-orange-400 hover:border-orange-400 transition duration-200 bg-white">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none text-gray-700"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-orange-500 cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-gray-400 cursor-pointer"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
