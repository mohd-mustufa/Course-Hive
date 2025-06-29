import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, GET_ADMIN_COURSES_URL, DELETE_COURSE_URL, GET_ADMIN_STATS_URL, ADMIN_LOGOUT_URL } from "../../utils/constants";
import AdminStats from "./AdminStats";
import AdminCourseCard from "./AdminCourseCard";
import ShimmerLoading from "./ShimmerLoading";
import toast from "react-hot-toast";
import Footer from "../layout/Footer";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalCoursesSold: 0,
    uniqueStudents: 0,
    totalRevenue: 0
  });
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    if (!admin?.token) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${GET_ADMIN_COURSES_URL}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
        withCredentials: true,
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!admin?.token) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${GET_ADMIN_STATS_URL}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
        withCredentials: true,
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default stats if API fails
      setStats({
        totalCourses: courses.length,
        totalCoursesSold: 0,
        uniqueStudents: 0,
        totalRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}${ADMIN_LOGOUT_URL}`, {
        withCredentials: true,
      });
      localStorage.removeItem("admin");
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response.data.error || "Error logging out");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${BASE_URL}${DELETE_COURSE_URL}${courseId}`, {
          headers: {
            Authorization: `Bearer ${admin?.token}`,
          },
          withCredentials: true,
        });
        toast.success("Course deleted successfully");
        fetchCourses(); // Refresh the list
        fetchStats(); // Refresh stats
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  if (loading) {
    return <ShimmerLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950">
      <div className="mx-auto container text-white">
        <div className="px-4 py-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-gray-400">
                Manage your courses and create new content
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="bg-transparent text-white py-2 px-4 border-white border rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <AdminStats stats={stats} />

          {/* Courses Section */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Courses</h2>
              <button
                onClick={() => navigate("/admin/course/create")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                + Add Course
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12 min-h-80">
                <div className="text-gray-400 text-lg mb-4">
                  You haven't created any courses yet!
                </div>
                <button
                  onClick={() => navigate("/admin/course/create")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Create Your First Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <AdminCourseCard
                    key={course._id}
                    course={course}
                    onDelete={handleDeleteCourse}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;