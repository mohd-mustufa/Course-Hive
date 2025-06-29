import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, GET_COURSE_URL, UPDATE_COURSE_URL } from "../../utils/constants";
import toast from "react-hot-toast";

function CourseUpdate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
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
      
      const course = response.data.course;
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
      });
      
      if (course.image?.url) {
        setCurrentImage(course.image.url);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    
    if (!admin?.token) {
      toast.error("Please login to update a course");
      return;
    }

    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);

      const response = await axios.put(`${BASE_URL}${UPDATE_COURSE_URL}${courseId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Course updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <div className="mx-auto container">
        <div className="px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Edit Course
              </h1>
              <p className="text-gray-400">
                Update your course information
              </p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="bg-transparent text-white py-2 px-4 border-white border rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Form */}
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
            {/* Course Image Display */}
            {currentImage && (
              <div className="mb-8 text-center">
                <img
                  src={currentImage}
                  alt="Course"
                  className="w-64 h-40 object-cover rounded-lg mx-auto"
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                  placeholder="Enter course title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                  placeholder="Enter course description"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                  placeholder="0.00"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Course"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseUpdate; 