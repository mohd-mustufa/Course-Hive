import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL, LOGOUT_URL } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from "axios";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${LOGOUT_URL}`, {
        withCredentials: true,
      });
      toast.success(response.data?.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.error || "Error logging out");
    }
  };

  return (
    <div className="flex justify-between items-center p-6">
      <div>
        {currentPath !== "/courses" && (
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="CourseHive"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-2xl text-orange-500 font-bold">CourseHive</h1>
          </Link>
        )}
      </div>

      <div className="space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-transparent text-white py-2 px-4 border-white border rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
          >
            Logout
          </button>
        ) : (
          <>
            {currentPath !== "/login" && (
              <Link
                to="/login"
                className="bg-transparent text-white py-2 px-4 border-white border rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
              >
                Login
              </Link>
            )}
            {currentPath !== "/signup" && (
              <Link
                to="/signup"
                className="bg-transparent text-white py-2 px-4 border-white border rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
              >
                Signup
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
