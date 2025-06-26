import React from "react";
import logo from "../../../public/logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="flex justify-between items-center p-6">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="CourseHive" className="w-10 h-10 rounded-full" />
        <h1 className="text-2xl text-orange-500 font-bold">CourseHive</h1>
      </div>

      <div className="space-x-4">
        <Link
          to={"/login"}
          className="bg-transparent text-white py-2 px-4 border-white border-1 rounded cursor-pointer"
        >
          Login
        </Link>
        <Link
          to={"/signup"}
          className="bg-transparent text-white py-2 px-4 border-white border-1 rounded cursor-pointer"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}

export default Header;
