import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BASE_URL,
  GET_ALL_COURSES_URL,
  GET_MY_COURSES_URL,
} from "../../utils/constants";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import CourseCard from "./CourseCard";
import CourseSidebar from "./CourseSidebar";

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${GET_ALL_COURSES_URL}`, {
          withCredentials: true,
        });
        setCourses(response?.data?.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // TODO: Reuse from MyCourses
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      return;
    }

    // Fetch purchased courses
    const fetchMyCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${GET_MY_COURSES_URL}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });
        setMyCourses(response.data.courses || []);
      } catch (error) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const renderShimmer = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="bg-gray-800 rounded-xl animate-pulse p-4 space-y-4 shadow-lg"
      >
        <div className="h-48 bg-gray-700 rounded-md"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        <div className="h-10 bg-gray-700 rounded w-full"></div>
      </div>
    ));
  };

  return (
    <div className="flex bg-gradient-to-r from-black to-blue-900 min-h-screen text-white">
      {/* Sidebar */}
      <div className="hidden lg:block w-1/5">
        <CourseSidebar />
      </div>

      {/* Main Content: header, courses, footer */}
      <div className="w-full lg:w-3/4 flex flex-col">
        <Header />

        <main className="flex-grow px-4 py-10">
          <h1 className="text-3xl font-semibold mb-6 text-orange-500 text-center">
            All Courses
          </h1>

          <div className="min-h-[300px] mt-6">
            {loading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {renderShimmer()}
              </div>
            ) : courses.length === 0 ? (
              <p className="text-center text-gray-300 text-lg">
                No courses available.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isPurchased={myCourses.some((c) => c._id === course._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default AllCourses;
