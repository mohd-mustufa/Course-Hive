import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, GET_COURSE_URL } from "../../utils/constants";
import toast from "react-hot-toast";
import Header from "../layout/Header";

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { courseId } = useParams();

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${GET_COURSE_URL}${courseId}`, {
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
          <Header />

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

export default CourseDetail; 