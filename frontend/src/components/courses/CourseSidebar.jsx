import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import logo from "../../../public/logo.png";
import axios from "axios";
import { BASE_URL, LOGOUT_URL } from "../../utils/constants";
import toast from "react-hot-toast";

function CourseSidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${LOGOUT_URL}`, {
        withCredentials: true,
      });
      toast.success(response.data?.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response.data.error || "Error logging out");
    }
  };

  const linkClass = (path) =>
    `flex items-center px-3 py-2 rounded hover:text-orange-400 ${
      location.pathname === path ? "bg-blue-800 text-orange-400" : ""
    }`;

  return (
    <aside className="hidden md:block w-64 h-screen fixed top-0 left-0 bg-gray-900 text-white p-6">
      <div className="flex items-center space-x-3 mb-10">
        <img src={logo} alt="Profile" className="h-10 w-10 rounded-full" />
        <h2 className="text-lg font-bold text-orange-500">CourseHive</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/" className={linkClass("/")}>
              <RiHome2Fill className="mr-2" /> Home
            </Link>
          </li>
          <li>
            <Link to="/courses" className={linkClass("/courses")}>
              <FaDiscourse className="mr-2" /> Courses
            </Link>
          </li>
          <li>
            <Link to="/my-courses" className={linkClass("/my-courses")}>
              <FaDownload className="mr-2" /> My Courses
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center hover:text-orange-400 cursor-pointer pl-3"
              >
                <IoLogOut className="mr-2" /> Logout
              </button>
            ) : (
              <Link to="/login" className={linkClass("/login")}>
                <IoLogIn className="mr-2" /> Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default CourseSidebar;
