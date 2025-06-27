import React from "react";
import logo from "../../../public/logo.png";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex justify-between items-center p-6">
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="CourseHive" className="w-10 h-10 rounded-full" />
        <h1 className="text-2xl text-orange-500 font-bold">CourseHive</h1>
      </Link>

      <div className="space-x-4">
        {currentPath !== "/login" && (
          <Link
            to={"/login"}
            className="bg-transparent text-white py-2 px-4 border-white border-1 rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
          >
            Login
          </Link>
        )}
        {currentPath !== "/signup" && (
          <Link
            to={"/signup"}
            className="bg-transparent text-white py-2 px-4 border-white border-1 rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
          >
            Signup
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
