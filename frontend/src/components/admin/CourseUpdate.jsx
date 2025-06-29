import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, GET_COURSE_URL, UPDATE_COURSE_URL, CREATE_COURSE_DETAILS_URL, UPDATE_COURSE_DETAILS_URL } from "../../utils/constants";
import toast from "react-hot-toast";
import AIContentGenerator from "./AIContentGenerator";

function CourseUpdate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [contentSections, setContentSections] = useState([
    { heading: "", content: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [hasExistingDetails, setHasExistingDetails] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
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
      const courseDetails = response.data.courseDetails;
      
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
      });
      
      if (course.image?.url) {
        setCurrentImage(course.image.url);
      }

      // Set content sections if they exist
      if (courseDetails && courseDetails.contentSections && courseDetails.contentSections.length > 0) {
        setContentSections(courseDetails.contentSections);
        setHasExistingDetails(true);
      } else {
        setContentSections([{ heading: "", content: "" }]);
        setHasExistingDetails(false);
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

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...contentSections];
    updatedSections[index][field] = value;
    setContentSections(updatedSections);
  };

  const addSection = () => {
    setContentSections([...contentSections, { heading: "", content: "" }]);
  };

  const removeSection = (index) => {
    if (contentSections.length > 1) {
      const updatedSections = contentSections.filter((_, i) => i !== index);
      setContentSections(updatedSections);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!admin?.token) {
      toast.error("Please login to update a course");
      return;
    }

    // Filter out empty sections (sections are optional)
    const validSections = contentSections.filter(section => 
      section.heading.trim() && section.content.trim()
    );

    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);

      await axios.put(`${BASE_URL}${UPDATE_COURSE_URL}${courseId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // Handle course details update/create
      if (validSections.length > 0) {
        if (hasExistingDetails) {
          // Update existing course details
          await axios.put(`${BASE_URL}${UPDATE_COURSE_DETAILS_URL}${courseId}`, {
            contentSections: validSections
          }, {
            headers: {
              Authorization: `Bearer ${admin.token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
        } else {
          // Create new course details
          await axios.post(`${BASE_URL}${CREATE_COURSE_DETAILS_URL}${courseId}`, {
            contentSections: validSections
          }, {
            headers: {
              Authorization: `Bearer ${admin.token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
        }
      }

      toast.success("Course updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleAIContentGenerated = (content) => {
    const updatedSections = [...contentSections];
    updatedSections[currentSectionIndex].content = content;
    setContentSections(updatedSections);
    toast.success("AI content added successfully!");
  };

  const openAIGenerator = (sectionIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setAiGeneratorOpen(true);
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
          <div className="bg-gray-900 rounded-lg p-6 max-w-4xl mx-auto">
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
              {/* Basic Course Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Content Sections (Optional) */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Content Sections (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addSection}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    + Add Section
                  </button>
                </div>
                
                <div className="space-y-4">
                  {contentSections.map((section, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-medium">Section {index + 1}</h4>
                        {contentSections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => handleSectionChange(index, "heading", e.target.value)}
                          placeholder="Section heading"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                        />
                        <div className="relative">
                          <textarea
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                            placeholder="Section content (you can use markdown)"
                            rows="4"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                          />
                          <button
                            type="button"
                            onClick={() => openAIGenerator(index)}
                            className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded text-xs font-medium transition-all transform hover:scale-105 cursor-pointer"
                          >
                            <div className="flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span>AI Generate</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Content sections help structure your course. Feel free to add them as you build your course.
                </p>
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

      <AIContentGenerator
        isOpen={aiGeneratorOpen}
        sectionHeading={contentSections[currentSectionIndex]?.heading || ""}
        courseTitle={formData.title || ""}
        courseContext={formData.description || ""}
        onContentGenerated={handleAIContentGenerated}
        onClose={() => setAiGeneratorOpen(false)}
      />
    </div>
  );
}

export default CourseUpdate; 