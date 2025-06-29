import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, GET_COURSE_URL } from "../../utils/constants";
import toast from "react-hot-toast";

function AdminCourseDetail() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const admin = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    if (!admin?.token) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${GET_COURSE_URL}${courseId}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
        withCredentials: true,
      });
      setCourse(response.data.course);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Course not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <div className="mx-auto container">
        <div className="px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Course Details
              </h1>
              <p className="text-gray-400">
                View your course information
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/admin/course/update/${courseId}`)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Edit Course
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="bg-transparent text-white py-2 px-4 border-white border rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Course Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-8">
              {/* Course Image */}
              <div className="aspect-video bg-gray-700 rounded-lg mb-8 flex items-center justify-center overflow-hidden">
                {course.image?.url ? (
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-500 text-8xl">📚</div>
                )}
              </div>
              
              {/* Course Title */}
              <h1 className="text-4xl font-bold text-white mb-6">{course.title}</h1>
              
              {/* Course Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Description</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
              </div>
              
              {/* Course Price */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <div className="text-4xl font-bold text-orange-500">${course.price}</div>
                <div className="text-gray-400 text-sm mt-1">Course Price</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCourseDetail; 