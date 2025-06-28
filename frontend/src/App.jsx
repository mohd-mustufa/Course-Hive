import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/user/Home";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import { Toaster } from "react-hot-toast";
import AllCourses from "./components/courses/AllCourses";
import CoursePurchase from "./components/courses/CoursePurchase";
import MyCourses from "./components/courses/MyCourses";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/courses" element={<AllCourses />} />
        <Route path="/purchase/:courseId" element={<CoursePurchase />} />
        <Route path="/my-courses" element={<MyCourses />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
