import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, LOGIN_URL } from "../../utils/constants";
import Header from "../layout/Header";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}${LOGIN_URL}`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      if (error?.response?.data?.error) {
        setErrorMessage(error?.response?.data?.error || "Login failed!!!");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white">
      <div className="mx-auto container">
        <Header />

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Welcome to <span className="text-orange-500">CourseHive</span>
            </h2>
            <p className="text-center text-gray-400 mb-6">
              Start Learning – Log in to your account
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="text-gray-400 mb-2 block">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="text-gray-400 mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
              </div>

              {errorMessage && (
                <div className="mb-4 text-red-500 text-center">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition cursor-pointer"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
