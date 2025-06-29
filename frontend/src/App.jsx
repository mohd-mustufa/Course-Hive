import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/user/Home";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import { Toaster } from "react-hot-toast";
import AllCourses from "./components/courses/AllCourses";
import CoursePurchase from "./components/courses/CoursePurchase";
import MyCourses from "./components/courses/MyCourses";
import CourseDetail from "./components/courses/CourseDetail";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminCourseDetail from "./components/admin/AdminCourseDetail";
import CourseUpdate from "./components/courses/CourseUpdate";
import CourseCreate from "./components/courses/CourseCreate";

function App() {
  // Check authentication status
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  
  const isUserAuthenticated = !!user;
  const isAdminAuthenticated = !!admin;
  const isAuthenticated = isUserAuthenticated || isAdminAuthenticated;

  return (
    <div>
      <Routes>
        {/* Public routes - redirect if authenticated */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              isAdminAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? (
              isAdminAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
            ) : (
              <Signup />
            )
          } 
        />

        {/* User-only routes */}
        <Route 
          path="/" 
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <Home />
            )
          } 
        />
        <Route 
          path="/courses" 
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <AllCourses />
            )
          } 
        />
        <Route 
          path="/purchase/:courseId" 
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : !isUserAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <CoursePurchase />
            )
          } 
        />
        <Route 
          path="/my-courses" 
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : !isUserAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <MyCourses />
            )
          } 
        />
        <Route 
          path="/courses/:courseId" 
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : !isUserAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <CourseDetail />
            )
          } 
        />

        {/* Admin-only routes */}
        <Route 
          path="/admin" 
          element={
            !isAdminAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <AdminDashboard />
            )
          } 
        />
        <Route 
          path="/admin/course/create" 
          element={
            !isAdminAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <CourseCreate />
            )
          } 
        />
        <Route 
          path="/admin/course/:courseId" 
          element={
            !isAdminAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <AdminCourseDetail />
            )
          } 
        />
        <Route 
          path="/admin/course/update/:courseId" 
          element={
            !isAdminAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <CourseUpdate />
            )
          } 
        />

        {/* Catch all route - redirect to appropriate dashboard */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? (
              isAdminAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
